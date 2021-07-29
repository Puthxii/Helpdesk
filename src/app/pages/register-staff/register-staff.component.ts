import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormGroup, FormControl, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-register-staff',
  templateUrl: './register-staff.component.html',
  styleUrls: ['./register-staff.component.scss']
})

export class RegisterStaffComponent implements OnInit {
  userForm: FormGroup;
  inputType = 'password';
  emailAlreadyExists
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    public router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.userForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25)
      ]],
      firstName: [''],
      lastName: [''],
      fullName: [''],
      mobileNumber: ['', [
        Validators.pattern('[- +()0-9]+')
      ]],
      roles: new FormGroup({
        supporter: new FormControl(false),
        maintenance: new FormControl(false),
        supervisor: new FormControl(false),
        developer: new FormControl(false),
        customer: new FormControl(false),
      }, requireCheckboxesToBeCheckedValidator()
      ),
    })

    function requireCheckboxesToBeCheckedValidator(minRequired = 1): ValidatorFn {
      return function validate(formGroup: FormGroup) {
        let checked = 0;

        Object.keys(formGroup.controls).forEach(key => {
          const control = formGroup.controls[key];
          if (control.value === true) {
            checked++;
          }
        });
        if (checked < minRequired) {
          return {
            requireCheckboxesToBeChecked: true,
          };
        }
        return null;
      };
    }
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

  hideShowPassword() {
    if (this.inputType === 'password') {
      this.inputType = 'text';
    } else {
      this.inputType = 'password';
    }
  };

  checkEmailExist() {
    this.userService.checkEmail(this.userForm.controls.email.value).valueChanges().subscribe(value => {
      this.emailAlreadyExists = value.length > 0;
    })
  }

  validateEmail() {
    const format = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return format.test(this.userForm.controls.email.value);
  }
}
