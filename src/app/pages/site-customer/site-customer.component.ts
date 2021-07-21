import { Component, OnInit } from '@angular/core';
import { Roles, User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user/user.service';
import Swal from "sweetalert2";

@Component({
  selector: 'site-customer',
  templateUrl: './site-customer.component.html',
  styleUrls: ['./site-customer.component.css']
})
export class SiteCustomerComponent implements OnInit {
  p = 1;
  Customer: User[];
  hideWhenNoStaff = false;
  noData = false;
  preLoader = true;
  searchValue = '';

  constructor(
    private user: UserService
  ) { }

  ngOnInit() {
    this.getCustomerList()
    this.dataState()
  }

  private getCustomerList() {
    this.user.getCustomer().snapshotChanges().subscribe(data => {
      this.Customer = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$uid'] = items.payload.doc['id'];
        this.Customer.push(item as User)
      })
    });
  }

  dataState() {
    this.user.getCustomer().snapshotChanges().subscribe(data => {
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
    this.user.getCustomerByNameSort(keyword).snapshotChanges().subscribe(data => {
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

  search() {
    if (this.searchValue !== undefined && this.searchValue !== null && this.searchValue !== '') {
      this.getCustomerByNameSort(this.searchValue)
      this.dataStateSearch(this.searchValue)
    } else {
      this.getCustomerList()
      this.dataState()
    }
  }


  getCustomerByNameSort(searchValue: string) {
    this.user.getCustomerByNameSort(searchValue).snapshotChanges().subscribe(data => {
      this.Customer = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$uid'] = items.payload.doc['id'];
        this.Customer.push(item as User)
      })
    });
  }

  alertDeleteCustomer(cus: User) {
    Swal.fire({
      title: 'Do you want to delete customer?',
      text: cus.name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2ED0B9',
      cancelButtonColor: '#9C9FA6',
      confirmButtonText: 'Yes, I do'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.user.deleteUserById(cus)
      }
    })
  }

}
