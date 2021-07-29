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
import { SupervisorGuard } from './guards/suppervisor.guard';
import { DeveloperGuard } from './guards/developer.guard';
import { StaffGuard } from './guards/staff.guard';
import { SiteComponent } from './pages/site/site.component';
import { SiteCustomerComponent } from './pages/site-customer/site-customer.component';
import { ProductComponent } from './pages/product/product.component';
import { EditStaffComponent } from './pages/edit-staff/edit-staff.component';
import { RegisterCustomerComponent } from './pages/register-customer/register-customer.component';
import { EditCustomerComponent } from './pages/edit-customer/edit-customer.component';
import { UserManageComponent } from './pages/user-manage/user-manage.component';
import { HistoryComponent } from './pages/history/history.component';
import { AddSiteComponent } from './pages/add-site/add-site.component';
import { SiteMngComponent } from './pages/site-mng/site-mng.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';

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
        canActivate: [StaffGuard]
      },
      {
        path: 'site',
        component: SiteComponent,
        canActivate: [StaffGuard]
      },
      {
        path: 'site-customer',
        component: SiteCustomerComponent,
        canActivate: [StaffGuard]
      },
      {
        path: 'product',
        component: ProductComponent,
        canActivate: [StaffGuard]
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
        canActivate: [SupervisorGuard],
        component: TicketSupComponent
      },
      {
        path: 'ticket-dev',
        canActivate: [DeveloperGuard],
        component: TicketDevComponent
      },
      {
        path: 'edit-staff',
        component: EditStaffComponent
      },
      {
        path: 'edit-staff/:id',
        component: EditStaffComponent
      },
      {
        path: 'register-customer',
        component: RegisterCustomerComponent
      },
      {
        path: 'register-customer/:sid',
        component: RegisterCustomerComponent
      },
      {
        path: 'edit-customer',
        component: EditCustomerComponent
      },
      {
        path: 'edit-customer/:id',
        component: EditCustomerComponent
      },
      {
        path: 'edit-customer/:id/:sid',
        component: EditCustomerComponent
      },
      {
        path: 'history',
        component: HistoryComponent
      },
      {
        path: 'add-site',
        component: AddSiteComponent
      },
      {
        path: 'site-mng',
        component: SiteMngComponent
      },
      {
        path: 'site-mng/:id',
        component: SiteMngComponent
      },
      {
        path: 'add-product',
        component: AddProductComponent
      },
      {
        path: 'edit-product',
        component: EditProductComponent
      },
      {
        path: 'edit-product/:id',
        component: EditProductComponent
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
    path: 'user-manage',
    component: UserManageComponent
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
