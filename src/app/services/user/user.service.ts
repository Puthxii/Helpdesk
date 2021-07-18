import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import {Roles, User} from "../../models/user.model";
import {Router} from "@angular/router";
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor (
    private afs: AngularFirestore,
    private router: Router
  ) { }

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
      this.router.navigate([`/staff`]);
    });
  }

  successDelete() {
    Swal.fire({
      icon: 'success',
      title: 'deleted',
      text: 'Your staff has been deleted',
    })
  }

  errorDelete() {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Your staff hasn\'t  been deleted',
    })
  }


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

  async addStaff(user: User){
    try {
      await (await this.afs.collection('users').add({
        email: user.email,
        name: user.name,
        firstName: user.email,
        lastName: user.email,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        photoURL: user.photoURL,
      }))
    } catch (error) {
      console.log(error)
    }
  }

  async deleteUserById(id: string) {
    try {
      await this.afs.collection('users').doc(id).delete();
      this.successDelete()
    } catch (err){
      this.errorDelete()
    }
  }

  async updateUser(user: User) {
    try {
      await this.afs.collection('users').doc(user.uid).update({
        uid: user.uid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName}`+' '+`${user.lastName}`,
        mobileNumber: user.mobileNumber,
        roles: user.roles,
      })
      this.successNotification()
    } catch (err){
      this.errorNotification()
    }
  }

}
