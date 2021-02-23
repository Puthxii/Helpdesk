import { TicketDevComponent } from './pages/ticket-dev/ticket-dev.component';
import { TicketSupComponent } from './pages/ticket-sup/ticket-sup.component';
import { TicketMaComponent } from './pages/ticket-ma/ticket-ma.component';
import { SiteTicketComponent } from './pages/site-ticket/site-ticket.component';
import { EditTicketComponent } from './pages/edit-ticket/edit-ticket.component';
import { DetailComponent } from './pages/detail/detail.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SupportGuard } from './guards/support.guard';
import { CustomerGuard } from './guards/customer.guard';
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
import { Error404Component } from './error-pages/error404/error404.component';
import { MaintenanceGuard } from './guards/ma.guard';

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
        canActivate: [SupportGuard],
        component: TicketComponent
      },
      {
        path: 'site-ticket',
        canActivate: [CustomerGuard],
        component: SiteTicketComponent
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'detail',
        component: DetailComponent
      },
      {
        path: 'detail/:id',
        component: DetailComponent
      },
      {
        path: 'edit-ticket',
        component: EditTicketComponent
      },
      {
        path: 'edit-ticket/:id',
        component: EditTicketComponent
      },
      {
        path: 'ticket-ma',
        canActivate: [MaintenanceGuard],
        component: TicketMaComponent
      },
      {
        path: 'ticket-sup',
        component: TicketSupComponent
      },
      {
        path: 'ticket-dev',
        component: TicketDevComponent
      }
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
    path: '**',
    component: Error404Component
  }
]
@NgModule({
  imports: [RouterModule.forRoot(router)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
