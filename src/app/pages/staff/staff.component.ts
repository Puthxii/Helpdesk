import { Roles } from '../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { User } from '../../models/user.model';

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
    private user: UserService
  ) { }

  ngOnInit() {
    this.dataState();
    this.user.getStaffsList().snapshotChanges().subscribe(data => {
      this.Staff = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$uid'] = items.payload.doc['id'];
        this.Staff.push(item as User)
      })
    });
  }

  dataState() {
    this.user.getStaffsList().snapshotChanges().subscribe(data => {
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
    } else {
      return '-';
    }
  }
}
