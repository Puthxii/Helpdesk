import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './pages/login/login.component'
import { from } from 'rxjs';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { AlertModule } from '../app/_alert/alert.module';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';

// Routes
export const router: Routes = [
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
        path: 'signup',
        component: SignupComponent
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

    ]
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }
]
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    ProfileComponent,
    SignupComponent,
    HomeLayoutComponent,
    LoginLayoutComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    AlertModule,
    RouterModule.forRoot(router),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [AuthService, AngularFireDatabase, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
