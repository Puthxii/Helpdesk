import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore) { }

  getStaffsList() {
    return this.afs.collection('users', (ref) => ref
      .where('roles.customer', '==', false)
      .orderBy('firstName', 'asc'));
  }

  getDeveloper() {
    return this.afs.collection('users', (ref) => ref
      .where('roles.developer', '==', true)
      .orderBy('firstName', 'asc'));
  }

  getUserbyId(uid: string) {
    return this.afs.collection('users').doc(uid);
  }

  getUserbyName(name: string) {
    return this.afs.collection('users', (ref) => ref
      .where('name', '==', name))
  }

  getUserbyNameSort(name: string) {
    return this.afs.collection('users', (ref) => ref
      .where('roles.customer', '==', false)
      .orderBy('fullName')
      .startAt(name)
      .endAt(name + '\uf8ff'));
  }

  getCustomer() {
    return this.afs.collection('users', (ref) => ref
      .where('roles.customer', '==', true)
      .orderBy('firstName', 'asc'));
  }

  getCustomerbyNameSort(name: string) {
    return this.afs.collection('users', (ref) => ref
      .where('roles.customer', '==', true)
      .orderBy('fullName')
      .startAt(name)
      .endAt(name + '\uf8ff'));
  }

}
