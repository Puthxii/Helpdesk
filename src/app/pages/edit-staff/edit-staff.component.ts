import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user/user.service";
import {User} from "../../models/user.model";
import Swal from "sweetalert2";

@Component({
  selector: 'app-edit-staff',
  templateUrl: './edit-staff.component.html',
  styleUrls: ['./edit-staff.component.css']
})
export class EditStaffComponent implements OnInit {
  userForm: FormGroup;
  id: string;
  user: User
  constructor (
    private fb: FormBuilder,
    public route: ActivatedRoute,
    public userService: UserService,
    public router: Router,
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
        roles: this.user.roles
      })
    })
  }

  buildForm(): void {
    this.userForm = this.fb.group({
      uid: [''],
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      firstName: [''],
      lastName: [''],
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
      return function validate (formGroup: FormGroup) {
        let checked = 0;

        Object.keys(formGroup.controls).forEach(key => {
          const control = formGroup.controls[key];
          if (control.value === true) {
            checked ++;
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

  update(): void {
    this.userService.updateUser(this.userForm.value)
  }

  alertCancelEditStaff() {
    Swal.fire({
      title: 'Do you want to cancel edit staff.',
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
