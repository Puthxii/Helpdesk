import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {firebase} from '@firebase/app';
import {FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider, TwitterAuthProvider} from '@firebase/auth-types';
import {AlertService, Options} from '../../_alert';
import {switchMap} from 'rxjs/operators';
import {User} from '../../models/user.model';
import {AngularFireDatabase, AngularFireObject} from '@angular/fire/database';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {environment} from "../../../environments/environment";
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  options: Options;
  authState: any = null;
  user$: Observable<User>;
  private secondaryApp = firebase.initializeApp(environment.firebaseConfig, "secondaryApp")
  constructor(
    protected alertService: AlertService,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private afs: AngularFirestore
  ) {
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
      this.authState = await this.afAuth.signInWithPopup(provider);
      this.updateUserDataToFirestore();
      this.router.navigate(['/']);
    } catch (error) {
      return console.log(error);
    }
  }

  async anonymousLogin() {
    try {
      const user = await this.afAuth.signInAnonymously();
      this.authState = user;
      this.router.navigate(['/']);
    } catch (error) {
      return console.log(error);
    }
  }

  async emailSignUp(email: string, password: string) {
    try {
      const user = await this.afAuth.createUserWithEmailAndPassword(email, password);
      this.authState = user;
      await this.updateUserDataToFirestore();
      console.log(this.authState)
      this.router.navigate(['/']);
    } catch (error) {
      return console.log(error);
    }
  }

  async emailLogin(email: string, password: string) {
    try {
      this.authState = await this.afAuth.signInWithEmailAndPassword(email, password);
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
    this.afAuth.signOut();
    this.router.navigate(['/login']);
  }

  private updateUserDataToDatabase(): void {
    const path = `users/${this.currentUserId}`;
    const userRef: AngularFireObject<any> = this.db.object(path);
    const data: User = {
      uid: this.authState.user.uid,
      email: this.authState.user.email,
      photoURL: this.authState.user.photoURL,
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
      photoURL: this.authState.user.photoURL,
    };
    return userRef.set(data, { merge: true });
  }

  isCustomer(user: User): boolean {
    const allowed = ['customer'];
    return this.checkAuthorization(user, allowed);
  }

  isSupporter(user: User): boolean {
    const allowed = ['supporter'];
    return this.checkAuthorization(user, allowed);
  }

  isMaintenance(user: User): boolean {
    const allowed = ['maintenance'];
    return this.checkAuthorization(user, allowed);
  }

  isSupervisor(user: User): boolean {
    const allowed = ['supervisor'];
    return this.checkAuthorization(user, allowed);
  }

  isDeveloper(user: User): boolean {
    const allowed = ['developer'];
    return this.checkAuthorization(user, allowed);
  }

  isStaff(user: User): boolean {
    const allowed = ['supporter', 'maintenance', 'supervisor', 'developer'];
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

  async registerUser(user: User) {
    try {
      const authUser = await this.secondaryApp.auth().createUserWithEmailAndPassword(user.email, user.password)
      await this.registerUserDataToFirestore(authUser, user);
      await this.secondaryApp.auth().signOut()
      this.successNotification()
    } catch (error) {
      this.errorNotification()
    }
  }

  private async registerUserDataToFirestore(authUser, user) {
    const path = `users/${authUser.user.uid}`;
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(path);
    const data: User = {
      uid: authUser.user.uid,
      email: authUser.user.email,
      password: user.password,
      photoURL: authUser.user.photoURL,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName}`+' '+`${user.lastName}`,
      mobileNumber: user.mobileNumber,
      roles: user.roles,
    };
    return userRef.set(data, { merge: true });
  }

  successNotification() {
    Swal.fire({
      text: 'Your staff has been saved',
      icon: 'success',
    }).then((result: any) => {
      this.router.navigate([`/staff`]);
    });
  }

  errorNotification() {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Your staff hasn\'t been saved',
    }).then((result: any) => {
      this.router.navigate([`/register-staff`]);
    });
  }

  async deleteEmail(user: User) {
    try {
      await this.secondaryApp.auth().signInWithEmailAndPassword(user.email, user.password)
      await this.secondaryApp.auth().currentUser.delete()
    } catch (error) {
      console.log(error)
    }
  }
}
