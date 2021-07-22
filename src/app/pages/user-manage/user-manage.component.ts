import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {UserManagementActions} from "../../models/enum.model";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import {takeUntil} from "rxjs/operators";
import {User} from "../../models/user.model";
import Swal from "sweetalert2";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit, OnDestroy  {
  ngUnsubscribe: Subject<any> = new Subject<any>();
  actions = UserManagementActions;
  mode: string;
  actionCode: string;
  email: string;
  actionCodeChecked: boolean;
  User: User[];
  resetForm: FormGroup;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm()
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(params => {
        if (!params) this.router.navigate(['/login']);
        this.mode = params['mode'];
        this.actionCode = params['oobCode'];
        switch (params['mode']) {
          case UserManagementActions.resetPassword: {
            this.authService.getAuth().verifyPasswordResetCode(this.actionCode)
              .then( email => {
                this.actionCodeChecked = true;
                this.email = email
                this.authService.findUserByEmail(email).snapshotChanges().subscribe(data => {
                  this.User = [];
                  data.map(items => {
                    const item = items.payload.doc.data();
                    this.User.push(item as User)
                  })
                });
              }).catch(error => {
                this.errorSent(error)
                this.router.navigate(['/login']);
              }
            );
          } break
          case UserManagementActions.recoverEmail: {
          } break
          case UserManagementActions.verifyEmail: {
          } break
          default: {
            this.router.navigate(['/login']);
          }
        }
      })
  }

  buildForm(): void {
    this.resetForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25)
      ]],
      confirmPassword: ['']
    }, { validators: this.checkPasswords });

  }

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('newPassword').value;
    let confirmPass = group.get('confirmPassword').value
    return pass === confirmPass ? null : { notSame: true }
  }

  get newPassword() {
    return this.resetForm.get('newPassword')
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword')
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  resetPassword() {
    this.authService.getAuth().confirmPasswordReset(
      this.actionCode,
      this.resetForm.controls.newPassword.value
    )
      .then( resp => {
        this.authService.updatePasswordById(this.User[0].uid, this.resetForm.controls.newPassword.value);
        this.successSent()
        this.authService.emailLogin(this.email, this.resetForm.controls.newPassword.value)
      }).catch(error => {
        this.errorSent(error)
    });
  }

  successSent() {
    Swal.fire({
      icon: 'success',
      text: 'New password has been saved',
    })
  }

  errorSent(error) {
    Swal.fire({
      icon: 'error',
      text: error.message
    })
  }

}
