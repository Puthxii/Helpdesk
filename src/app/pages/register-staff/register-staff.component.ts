import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Roles} from "../../models/user.model";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register-staff',
  templateUrl: './register-staff.component.html',
  styleUrls: ['./register-staff.component.scss']
})

export class RegisterStaffComponent implements OnInit {
  userForm: FormGroup;
  constructor (
    private fb: FormBuilder,
    private auth: AuthService,
    public router: Router,
  )
  { }

  ngOnInit() {
    this.buildForm();
    this.setDefaultRole()
  }

  buildForm(): void {
    this.userForm = this.fb.group({
      email: [''],
      password: [''],
      firstName: [''],
      lastName: [''],
      fullName: [''],
      mobileNumber: [''],
      roles: this.fb.group({
        supporter: [''],
        maintenance: [''],
        supervisor: [''],
        developer: [''],
        customer: ['']
      }),
    })

  }

  get email() {
    return this.userForm.get('email');
  }

  get password() {
    return this.userForm.get('password');
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

  private setDefaultRole() {
    this.userForm.patchValue({
      roles: {
        supporter: false,
        maintenance: false,
        supervisor: false,
        developer: false,
        customer: false,
      }
    })
  }

  register(): void {
    this.auth.registerUser(this.userForm.value)
  }

  alertCancelAddStaff() {
    Swal.fire({
      title: 'Do you want to cancel add staff.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2ED0B9',
      cancelButtonColor: '#9C9FA6',
      confirmButtonText: 'Yes, I do'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.router.navigate([`/staff`]);
      }
    })
  }
}
