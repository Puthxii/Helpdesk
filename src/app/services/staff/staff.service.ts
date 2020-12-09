import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  staffsRef: AngularFireList<any>;
  constructor(
    private db: AngularFireDatabase
  ) { }


  getStaffsList() {
    this.staffsRef = this.db.list('staff');
    return this.staffsRef;
  }

}
