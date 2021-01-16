import { SiteTicketComponent } from './pages/site-ticket/site-ticket.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component'
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { AlertModule } from '../app/_alert/alert.module';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { StaffComponent } from './pages/staff/staff.component';
import { RegisterStaffComponent } from './pages/register-staff/register-staff.component';
import { AddTicketComponent } from './pages/add-ticket/add-ticket.component';
import { TicketComponent } from './pages/ticket/ticket.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DetailComponent } from './pages/detail/detail.component';
import { Error404Component } from './error-pages/error404/error404.component';
import { EditTicketComponent } from './pages/edit-ticket/edit-ticket.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    SignupComponent,
    StaffComponent,
    RegisterStaffComponent,
    HomeLayoutComponent,
    LoginLayoutComponent,
    AddTicketComponent,
    TicketComponent,
    DetailComponent,
    Error404Component,
    EditTicketComponent,
    SiteTicketComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    AlertModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    NgMultiSelectDropDownModule.forRoot(),
    AngularMyDatePickerModule

  ],
  providers: [AuthService, AngularFireDatabase, AuthGuard],
  bootstrap: [AppComponent]
})

export class AppModule { }
