import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore) { }

  getStaffsList() {
    return this.afs.collection('users', ref => ref
      .where('roles.customer', '==', false)
      .orderBy('firstName', 'desc'));
  }

  getDeveloper() {
    return this.afs.collection('users', ref => ref
      .where('roles.developer', '==', true)
      .orderBy('firstName', 'desc'));
  }

  getUserbyId(uid: string) {
    return this.afs.collection('users').doc(uid);
  }

  getUserbyName(name: string) {
    return this.afs.collection('users', ref => ref
      .where('name', '==', name))
  }

  getDeveloper() {
    return this.afs.collection('users', ref => ref
      .where('roles.developer', '==', true)
      .orderBy('firstName', 'desc'));
  }
}
