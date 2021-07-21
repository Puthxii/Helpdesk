import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {firebase} from '@firebase/app';
import {FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider, TwitterAuthProvider} from '@firebase/auth-types';
import {AlertService, Options} from '../../_alert';
import {switchMap} from 'rxjs/operators';
import {Roles, User} from '../../models/user.model';
import {AngularFireDatabase, AngularFireObject} from '@angular/fire/database';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {environment} from "../../../environments/environment";
import Swal from "sweetalert2";
import {firestore} from "firebase";

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
      this.successSent()
    } catch (error) {
      this.errorSent()
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
      if (user.roles.customer === true) {
        await this.registerCustomerData(authUser, user);
        await this.updateSiteCustomer(user, authUser.user.uid)
      } else {
        await this.registerStaffData(authUser, user);
      }
      await this.secondaryApp.auth().signOut()
      this.successNotification(user.roles)
    } catch (error) {
      this.errorNotification(user.roles)
    }
  }

  private async registerStaffData(authUser, user) {
    const path = `users/${authUser.user.uid}`;
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(path);
    const keyword = await this.generateKeyword(`${user.firstName}`+' '+`${user.lastName}`)
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
      keyword
    };
    return userRef.set(data, { merge: true });
  }

  private async registerCustomerData(authUser, user) {
    const path = `users/${authUser.user.uid}`;
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(path);
    const keyword = await this.generateKeyword(`${user.firstName}`+' '+`${user.lastName}`+' '+`${user.site}`)
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
      site: user.site,
      siteId: user.siteId,
      keyMan: user.keyMan,
      keyword
    };
    return userRef.set(data, { merge: true });
  }

  successNotification(roles: Roles) {
    Swal.fire({
      text: 'Your user has been saved',
      icon: 'success',
    }).then((result: any) => {
      if (roles.customer === true){
        this.router.navigate([`/site-customer`]);
      } else {
        this.router.navigate([`/staff`]);
      }
    });
  }

  errorNotification(roles: Roles) {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Your user hasn\'t been saved',
    }).then((result: any) => {
      if (roles.customer === true){
        this.router.navigate([`/register-customer`]);
      } else {
        this.router.navigate([`/register-staff`]);
      }
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

  emailAuthExist(email) {
    return firebase.auth().fetchSignInMethodsForEmail(email)
   }

  private async generateKeyword(fullName: string) {
    function creatKeywords(str: string) {
      const arrName = []
      let curOrder = ''
      let curName2 = ''
      let curName3 = ''
      let curName4 = ''
      const chars = str.split('');
      for (let i = 0; i < chars.length; i++) {
        curOrder += chars[i]
        if (chars[i + 1] != undefined) {
          curName2 += chars[i]
          curName2 += chars[i + 1]
        }
        if (chars[i + 1] && chars[i + 2] != undefined) {
          curName3 += chars[i]
          curName3 += chars[i + 1]
          curName3 += chars[i + 2]
        }
        if (chars[i + 1] && chars[i + 2] && chars[i + 3] != undefined) {
          curName4 += chars[i]
          curName4 += chars[i + 1]
          curName4 += chars[i + 2]
          curName4 += chars[i + 3]
        }
        arrName.push(curOrder, chars[i], curName2, curName3, curName4)
        curName2 = ''
        curName3 = ''
        curName4 = ''
      }
      return arrName
    }
    const keywordSubject = await creatKeywords(fullName)
    const keywordLowerCase = await creatKeywords(fullName.toLowerCase())
    const keywordUpperCase = await creatKeywords(fullName.toUpperCase())
    return [
      '',
      ...keywordSubject,
      ...keywordLowerCase,
      ...keywordUpperCase
    ]
  }

  private async updateSiteCustomer(user: User, uid: string) {
    try {
      await this.afs.collection('site').doc(user.siteId).update({
        users: firestore.FieldValue.arrayUnion(`${user.firstName}`+' '+`${user.lastName}`),
        userId: firestore.FieldValue.arrayUnion(uid)
      })
    } catch (err){
      console.log(err)
    }
  }

  successSent() {
    Swal.fire({
      icon: 'success',
      title: 'Email sent',
    })
  }

  errorSent() {
    Swal.fire({
      icon: 'error',
      title: 'Send email failed',
    })
  }

}
