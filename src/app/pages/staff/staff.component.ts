import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Staff } from '../../services/staff';   // Student interface class for Data types.

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  p = 1;
  Staff: Staff[];
  hideWhenNoStaff = false;
  noData = false;
  preLoader = true;

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.dataState();
    const s = this.auth.getStaffsList();
    s.snapshotChanges().subscribe(data => {
      this.Staff = [];
      data.forEach(item => {
        const a = item.payload.toJSON();
        a['$key'] = item.key;
        this.Staff.push(a as Staff);
      });
    });
  }

  dataState() {
    this.auth.getStaffsList().valueChanges().subscribe(data => {
      this.preLoader = false;
      if (data.length <= 0) {
        this.hideWhenNoStaff = false;
        this.noData = true;
      } else {
        this.hideWhenNoStaff = true;
        this.noData = false;
      }
    });
  }

}
