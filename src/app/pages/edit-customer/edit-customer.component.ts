import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user/user.service";
import {User} from "../../models/user.model";
import Swal from "sweetalert2";

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {
  userForm: FormGroup;
  id: string;
  user: User
  constructor (
    private fb: FormBuilder,
    private auth: AuthService,
    public router: Router,
    private userService: UserService,
    public route: ActivatedRoute,
  ) {
    this.route.params.subscribe(params => this.id = params.id)
  }

  ngOnInit() {
    this.buildForm();
    this.userService.getUserById(this.id).valueChanges().subscribe( data => {
      this.user = data as User
      this.userForm.patchValue({
        uid: this.user.uid,
        email: this.user.email,
        password: this.user.password,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        fullName: this.user.fullName,
        mobileNumber: this.user.mobileNumber,
        roles: this.user.roles,
        site: this.user.site,
        siteId: this.user.siteId,
        keyMan: this.user.keyMan
      })
    })
  }

  buildForm(): void {
    this.userForm = this.fb.group({
      uid: [''],
      email: [''],
      password: [''],
      firstName: [''],
      lastName: [''],
      fullName: [''],
      mobileNumber: ['', [
        Validators.pattern('[- +()0-9]+')
      ]],
      site: [''],
      siteId: [''],
      keyMan: [''],
      roles: new FormGroup({
          supporter: new FormControl(false),
          maintenance: new FormControl(false),
          supervisor: new FormControl(false),
          developer: new FormControl(false),
          customer: new FormControl(true),
        }
      ),
    })
  }

  get email() {
    return this.userForm.get('email');
  }

  get site() {
    return this.userForm.get('site');
  }

  get firstName() {
    return this.userForm.get('firstName');
  }

  get lastName() {
    return this.userForm.get('lastName');
  }

  get mobileNumber() {
    return this.userForm.get('mobileNumber');
  }

  get roles() {
    return this.userForm.get('roles');
  }

  get keyMan() {
    return this.userForm.get('keyMan');
  }

  update(): void {
    console.log(this.userForm.value)
    this.userService.updateCustomer(this.userForm.value)
  }

  alertCancelEditCustomer() {
    Swal.fire({
      title: 'Do you want to cancel edit customer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2ED0B9',
      cancelButtonColor: '#9C9FA6',
      confirmButtonText: 'Yes, I do'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.router.navigate([`/site-customer`]);
      }
    })
  }
}
