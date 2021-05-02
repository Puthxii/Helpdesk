import { Component, OnInit } from '@angular/core';
import { Roles, User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user/user.service';

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
    this.dataState();
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

  getRoles(roles: Roles): string {
    let role: string
    if (roles.customer === true) {
      role = 'customer'
    } else {
      role = 'customer'
    }
    return role
  }

  search() {
    const searchValue = this.searchValue
    if (searchValue != null) {
      this.getCustomerbyNameSort(searchValue)
    }
  }

  getCustomerbyNameSort(searchValue: any) {
    this.user.getCustomerbyNameSort(searchValue).snapshotChanges().subscribe(data => {
      this.Customer = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$uid'] = items.payload.doc['id'];
        this.Customer.push(item as User)
      })
    });
  }

}
