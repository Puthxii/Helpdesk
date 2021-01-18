import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore) { }

  getStaffsList() {
    return this.afs.collection('users', ref => ref
      .where('roles.supporter', '==', true));
  }

  getUserbyId(uid: string) {
    return this.afs.collection('users').doc(uid);
  }

  getUserbyName(name: string) {
    return this.afs.collection('users', ref => ref
      .where('name', '==', name))
  }
}
