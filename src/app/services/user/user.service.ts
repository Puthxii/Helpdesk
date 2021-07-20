import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import {Roles, User} from "../../models/user.model";
import {Router} from "@angular/router";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor (
    private afs: AngularFirestore,
    private router: Router,
    private authService: AuthService
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

  getUserByNameSort(keyword: string) {
    return this.afs.collection('users', (ref) => ref
      .where('roles.customer', '==', false)
      .where('keyword', 'array-contains', keyword)
    )
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

  async deleteUserById(user: User) {
    try {
      await this.afs.collection('users').doc(user.uid).delete();
      await this.authService.deleteEmail(user)
      this.successDelete()
    } catch (err){
      this.errorDelete()
    }
  }

  async updateUser(user: User) {
    try {
      const keyword = await this.generateKeyword(`${user.firstName}`+' '+`${user.lastName}`)
      await this.afs.collection('users').doc(user.uid).update({
        uid: user.uid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName}`+' '+`${user.lastName}`,
        mobileNumber: user.mobileNumber,
        roles: user.roles,
        keyword
      })
      this.successNotification()
    } catch (err){
      this.errorNotification()
    }
  }

  checkEmail(email: string) {
    email = email.toLowerCase()
    return this.afs.collection('users', (ref) => ref
      .where('email', '==', email))
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

}
