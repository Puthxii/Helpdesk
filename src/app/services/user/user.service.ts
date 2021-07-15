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

  getUserById(uid: string) {
    return this.afs.collection('users').doc(uid);
  }

  getUserByName(name: string) {
    return this.afs.collection('users', (ref) => ref
      .where('fullName', '==', name))
  }

  getUserByNameSort(name: string) {
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

  getCustomerByNameSort(name: string) {
    return this.afs.collection('users', (ref) => ref
      .where('roles.customer', '==', true)
      .orderBy('fullName')
      .startAt(name)
      .endAt(name + '\uf8ff'));
  }

}
