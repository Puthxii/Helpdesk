import { Roles } from '../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { User } from '../../models/user.model';
import Swal from "sweetalert2";

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
  searchValue = '';

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
    let role: string
    if (roles.supporter === true) {
      role = 'Supporter'
    } else if (roles.maintenance === true) {
      role = 'Maintenance'
    } else if (roles.supervisor === true) {
      role = 'Supervisor'
    } else if (roles.developer === true) {
      role = 'Developer'
    } else {
      role = 'Staff'
    }
    return role
  }

  search() {
    const searchValue = this.searchValue
    if (searchValue != null) {
      this.getUserByNameSort(searchValue)
    }
  }

  getUserByNameSort(searchValue: any) {
    this.user.getUserByNameSort(searchValue).snapshotChanges().subscribe(data => {
      this.Staff = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$uid'] = items.payload.doc['id'];
        this.Staff.push(item as User)
      })
    });
  }

  alertDeleteStaff(id: string, name) {
    Swal.fire({
      title: 'Do you want to delete staff?',
      text: name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2ED0B9',
      cancelButtonColor: '#9C9FA6',
      confirmButtonText: 'Yes, I do'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.user.deleteUserById(id)
      }
    })
  }
}
