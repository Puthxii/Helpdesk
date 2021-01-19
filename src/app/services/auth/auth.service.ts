import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { firebase } from '@firebase/app';
import '@firebase/auth';
import { GithubAuthProvider, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider } from '@firebase/auth-types';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AlertService } from '../../_alert/alert.service';
import { Options } from '../../_alert/alert.model';
import { switchMap } from 'rxjs/operators';
import { User } from '../../models/user.model';
@Injectable()
export class AuthService {
  options: Options;
  authState: any = null;
  userRef: AngularFireObject<any>;
  user$: Observable<User>;
  constructor(
    protected alertService: AlertService,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private afs: AngularFirestore) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });

    this.user$ = this.afAuth.authState.pipe(switchMap(user => {
      if (user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return of(null);
      }
    }));
  }
  get authenticated(): boolean {
    return this.authState !== null;
  }
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }
  get currentUserObservable(): any {
    return this.afAuth.authState;
  }
  get currentUserId(): string {
    return this.authenticated ? this.authState.user.uid : '';
  }
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false;
  }
  get currentUserDisplayName(): string {
    if (!this.authState) {
      return 'Guest';
    } else if (this.currentUserAnonymous) {
      return 'Anonymous';
    } else {
      return this.authState.displayName || 'User without a Name';
    }
  }
  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.socialSignIn(provider);
  }
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.socialSignIn(provider);
  }
  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.socialSignIn(provider);
  }
  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.socialSignIn(provider);
  }
  private async socialSignIn(provider: GithubAuthProvider | GoogleAuthProvider | FacebookAuthProvider | TwitterAuthProvider) {
    try {
      const credential = await this.afAuth.auth.signInWithPopup(provider);
      console.log(credential.user);
      this.authState = credential.user;
      this.updateUserDataToDatabase();
      this.router.navigate(['/']);
    } catch (error) {
      return console.log(error);
    }
  }
  async anonymousLogin() {
    try {
      const user = await this.afAuth.auth.signInAnonymously();
      this.authState = user;
      this.router.navigate(['/']);
    } catch (error) {
      return console.log(error);
    }
  }
  async emailSignUp(email: string, password: string) {
    try {
      const user = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      this.authState = user;
      this.updateUserDataToFirestore();
      this.updateUserDataToDatabase();
      this.router.navigate(['/']);
    } catch (error) {
      return console.log(error);
    }
  }
  async emailLogin(email: string, password: string) {
    try {
      const user = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      this.authState = user;
      this.router.navigate(['/']);
      this.alertService.success('Login success', this.options = {
        autoClose: true,
        keepAfterRouteChange: false
      });
    } catch (error) {
      this.alertService.error(error.message, this.options = {
        autoClose: true,
        keepAfterRouteChange: false
      });
    }
  }
  async resetPassword(email: string) {
    const fbAuth = firebase.auth();
    try {
      await fbAuth.sendPasswordResetEmail(email);
      return console.log('email sent');
    } catch (error) {
      return console.log(error);
    }
  }
  getCurrentLoggedIn() {
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.router.navigate(['/']);
      }
    });
  }
  signOut(): void {
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }
  private updateUserDataToDatabase(): void {
    const path = `users/${this.currentUserId}`;
    const userRef: AngularFireObject<any> = this.db.object(path);
    const data: User = {
      uid: this.authState.user.uid,
      email: this.authState.user.email,
      roles: {
        customer: true
      }
    };
    userRef.update(data)
      .catch(error => console.log(error));
  }

  private updateUserDataToFirestore() {
    const path = `users/${this.currentUserId}`;
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(path);
    const data: User = {
      uid: this.authState.user.uid,
      email: this.authState.user.email,
      roles: {
        customer: true
      }
    };
    return userRef.set(data, { merge: true });
  }

  isSupporter(user: User): boolean {
    const allowed = ['supporter'];
    return this.checkAuthorization(user, allowed);
  }

  isCustomer(user: User): boolean {
    const allowed = ['customer'];
    return this.checkAuthorization(user, allowed);
  }

  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) {
      return false;
    }
    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true;
      }
    }
    return false;
  }
}
