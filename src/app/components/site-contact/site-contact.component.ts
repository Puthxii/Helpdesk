import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-site-contact',
  templateUrl: './site-contact.component.html',
  styleUrls: ['./site-contact.component.css']
})
export class SiteContactComponent implements OnInit {
  @Input() id: string;
  Customer: User[];
  constructor(
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.getCustomerBySite()
  }

  getCustomerBySite() {
    this.userService.getCustomerBySiteId(this.id).snapshotChanges().subscribe(data => {
      this.Customer = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$uid'] = items.payload.doc['id'];
        this.Customer.push(item as User)
      })
    });
  }

  getStar(star: boolean) {
    let icon: string
    if (star) {
      icon = `fas fa-star on-site-color`
    }
    return icon
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
        this.userService.deleteUserById(cus)
      }
    })
  }
}
