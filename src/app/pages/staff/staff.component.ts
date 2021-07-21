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
    this.getStaffList();
    this.dataState();
  }

  private getStaffList() {
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

  dataStateSearch(keyword) {
    this.user.getUserByNameSort(keyword).snapshotChanges().subscribe(data => {
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

  getRoles(roles: Roles) {
    let Supporter
    let Maintenance
    let Supervisor
    let Developer
    if (roles.supporter === true) {
      Supporter = 'Supporter'
    } if (roles.maintenance === true) {
      Maintenance = 'Maintenance'
    } if (roles.supervisor === true) {
      Supervisor = 'Supervisor'
    } if (roles.developer === true) {
      Developer = 'Developer'
    }
    return [Supporter, Maintenance, Supervisor, Developer].filter((role): role is string => role !== undefined).join(", ");
  }

  search() {
    if (this.searchValue !== undefined && this.searchValue !== null && this.searchValue !== '') {
      this.getUserByNameSort(this.searchValue)
      this.dataStateSearch(this.searchValue)
    } else {
      this.getStaffList()
      this.dataState()
    }
  }

  getUserByNameSort(searchValue: string) {
    this.user.getUserByNameSort(searchValue).snapshotChanges().subscribe(data => {
      this.Staff = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$uid'] = items.payload.doc['id'];
        this.Staff.push(item as User)
      })
    });
  }

  alertDeleteStaff(staff: User) {
    Swal.fire({
      title: 'Do you want to delete staff?',
      text: staff.name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2ED0B9',
      cancelButtonColor: '#9C9FA6',
      confirmButtonText: 'Yes, I do'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.user.deleteUserById(staff)
      }
    })
  }

}
