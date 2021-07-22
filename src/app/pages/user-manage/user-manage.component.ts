import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {UserManagementActions} from "../../models/enum.model";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import {takeUntil} from "rxjs/operators";

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
  newPassword: string;
  confirmPassword: string;
  actionCodeChecked: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(params => {
        if (!params) this.router.navigate(['/login']);
        this.mode = params['mode'];
        this.actionCode = params['oobCode'];
        switch (params['mode']) {
          case UserManagementActions.resetPassword: {
            this.authService.getAuth().verifyPasswordResetCode(this.actionCode)
              .then(email => {
                this.email = email
                this.actionCodeChecked = true;
              }).catch(e => {
                alert(e);
                this.router.navigate(['/login']);
              }
            );
          } break
          case UserManagementActions.recoverEmail: {
          } break
          case UserManagementActions.verifyEmail: {
          } break
          default: {
            console.log('query parameters are missing');
            this.router.navigate(['/login']);
          }
        }
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  handleResetPassword() {
    if (this.newPassword != this.confirmPassword) {
      alert('New Password and Confirm Password do not match');
      return;
    }
    this.authService.getAuth().confirmPasswordReset(
      this.actionCode,
      this.newPassword
    )
      .then(resp => {
        alert('New password has been saved');
        this.router.navigate(['/login']);
      }).catch(e => {
        alert(e);
    });
  }

}
