import { Roles } from './../../services/user.model';
import { Component, OnInit } from '@angular/core';
import { StaffService } from 'src/app/services/staff/staff.service';
import { User } from '../../services/user.model';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  p = 1;
  Staff: User[];
  hideWhenNoStaff = false;
  noData = false;
  preLoader = true;

  constructor(
    private staff: StaffService
  ) { }

  ngOnInit() {
    this.dataState();
    const s = this.staff.getStaffsList();
    s.snapshotChanges().subscribe(data => {
      this.Staff = [];
      data.forEach(item => {
        const a = item.payload.toJSON();
        a['$uid'] = item.key;
        this.Staff.push(a as User);
      });
    });
  }

  dataState() {
    this.staff.getStaffsList().valueChanges().subscribe(data => {
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

  getRoles(roles: Roles): string {
    if (roles.supporter === true) {
      return 'supporter';
    } else if (roles.customer === true) {
      return 'customer';
    } else {
      return 'customer';
    }
  }
}
