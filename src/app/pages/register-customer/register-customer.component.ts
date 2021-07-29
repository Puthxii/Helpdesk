import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import Swal from 'sweetalert2';
import { SiteService } from '../../services/site/site.service';
import { Observable } from 'rxjs';
import { Site } from '../../models/site.model';

@Component({
  selector: 'app-register-customer',
  templateUrl: './register-customer.component.html',
  styleUrls: ['./register-customer.component.css']
})
export class RegisterCustomerComponent implements OnInit {
  userForm: FormGroup;
  emailAlreadyExists
  site$: Observable<any>;
  Site: any[];
  sid: string;
  siteBy: Site
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    public router: Router,
    private userService: UserService,
    private siteService: SiteService,
    public route: ActivatedRoute,
  ) {
    this.route.params.subscribe(params => this.sid = params.sid)
  }

  ngOnInit() {
    this.buildForm();
    this.site$ = this.siteService.getSitesList();
    this.getSite();
    this.generatePassword()
  }

  getSite() {
    if (this.sid) {
      this.siteService.getSiteById(this.sid).subscribe(data => {
        this.siteBy = data as Site
        this.userForm.patchValue({
          site: this.siteBy.initials
        })
        this.getSiteId(this.siteBy.initials)
      })
    }
  }

  buildForm(): void {
    this.userForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      password: [''],
      firstName: [''],
      lastName: [''],
      fullName: [''],
      mobileNumber: ['', [
        Validators.pattern('[- +()0-9]+')
      ]],
      site: [''],
      siteId: [''],
      keyMan: false,
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

  get firstName() {
    return this.userForm.get('firstName');
  }

  get lastName() {
    return this.userForm.get('lastName');
  }

  get mobileNumber() {
    return this.userForm.get('mobileNumber');
  }

  get site() {
    return this.userForm.get('site');
  }

  register(): void {
    if (this.sid) {
      this.auth.registerUser(this.userForm.value, this.sid)
    } else {
      this.auth.registerUser(this.userForm.value)
    }
  }

  generatePassword() {
    let password = Math.random().toString(36).slice(-8);
    this.userForm.patchValue({
      password
    });
  }

  alertCancelAddCustomer() {
    Swal.fire({
      title: 'Do you want to cancel add customer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2ED0B9',
      cancelButtonColor: '#9C9FA6',
      confirmButtonText: 'Yes, I do'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        if (this.sid) {
          this.router.navigate([`/site-mng/${this.sid}`]);
        } else {
          this.router.navigate([`/site-customer`]);
        }
      }
    })
  }

  checkEmailExist() {
    this.userService.checkEmail(this.userForm.controls.email.value).valueChanges().subscribe(value => {
      this.emailAlreadyExists = value.length > 0;
    })
  }

  validateEmail() {
    const format = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return format.test(this.userForm.controls.email.value);
  }

  getSiteId(site: string) {
    this.siteService.getSitesByName(site).snapshotChanges().subscribe(data => {
      this.Site = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$key'] = items.payload.doc['id'];
        this.Site.push(item as Site)
        this.setSiteId(this.Site[0].$key);
      })
    });
  }

  private setSiteId(id: string) {
    this.userForm.patchValue({
      siteId: id
    });
  }

}
