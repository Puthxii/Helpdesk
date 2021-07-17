import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Roles} from "../../models/user.model";

@Component({
  selector: 'app-register-staff',
  templateUrl: './register-staff.component.html',
  styleUrls: ['./register-staff.component.scss']
})

export class RegisterStaffComponent implements OnInit {
  userForm: FormGroup;
  constructor (
    private fb: FormBuilder,
    private auth: AuthService)
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

  signup(): void {
    this.auth.registerUser(this.userForm.value)
  }

}
