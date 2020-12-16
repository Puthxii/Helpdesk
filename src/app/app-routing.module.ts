import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SupportGuard } from './guards/support.guard';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { AddTicketComponent } from './pages/add-ticket/add-ticket.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterStaffComponent } from './pages/register-staff/register-staff.component';
import { SignupComponent } from './pages/signup/signup.component';
import { StaffComponent } from './pages/staff/staff.component';
import { TicketComponent } from './pages/ticket/ticket.component';

const router: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'staff',
        component: StaffComponent,
        canActivate: [SupportGuard]
      },
      {
        path: 'register-staff',
        component: RegisterStaffComponent
      },
      {
        path: 'add-ticket',
        component: AddTicketComponent
      },
      {
        path: 'ticket',
        component: TicketComponent
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'signup',
        component: SignupComponent
      },
    ]
  },
  {
    path: 'error-pages',
    loadChildren: () => import('./error-pages/error-pages.module').then(m => m.ErrorPagesModule)
  }
]
@NgModule({
  imports: [RouterModule.forRoot(router)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
