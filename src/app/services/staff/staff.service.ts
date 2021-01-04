import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class StaffService {
  constructor(private afs: AngularFirestore) { }

  getStaffsList() {
    return this.afs.collection('users', ref => ref.where('roles.supporter', '==', true));
  }

}
