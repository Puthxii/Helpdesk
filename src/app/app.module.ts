import { TicketDevComponent } from './pages/ticket-dev/ticket-dev.component';
import { TicketSupComponent } from './pages/ticket-sup/ticket-sup.component';
import { TicketMaComponent } from './pages/ticket-ma/ticket-ma.component';
import { SiteTicketComponent } from './pages/site-ticket/site-ticket.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component'
import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';
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
import { CurrentStatus, iconAttachFile, Prioritys, Types } from './shared/constant';
import { DatePipe } from './pipes/date.pipe';
import { UploadFormComponent } from './components/upload-form/upload-form.component';
import { UploadDetailsComponent } from './components/upload-details/upload-details.component';
import { UploadListComponent } from './components/upload-list/upload-list.component';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { UploadEditComponent } from './components/upload-edit/upload-edit.component';
import { UploadDetailListComponent } from './components/upload-detail-list/upload-detail-list.component';

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
    SiteTicketComponent,
    TicketMaComponent,
    TicketSupComponent,
    TicketDevComponent,
    DatePipe,
    UploadFormComponent,
    UploadListComponent,
    UploadDetailsComponent,
    UploadEditComponent,
    UploadDetailListComponent
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
    AngularMyDatePickerModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule
  ],
  providers: [
    AuthService,
    AngularFireDatabase,
    AngularFirestore,
    AuthGuard,
    { provide: 'PRIORITY', useValue: Prioritys },
    { provide: 'TYPES', useValue: Types },
    { provide: 'STATUS', useValue: CurrentStatus },
    { provide: 'ICONATTACHFILE', useValue: iconAttachFile }

  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
