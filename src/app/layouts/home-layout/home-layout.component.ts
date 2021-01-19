import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css']
})
export class HomeLayoutComponent implements OnInit {
  User: User;
  user;
  AuthService: any;
  user$: any;

  constructor(
    private router: Router,
    private auth: AuthService,
    public userService: UserService
  ) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user)
    this.getUserValue();
  }

  toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('toggled');
  }
  getUserValue() {
    this.userService.getUserbyId(this.User.uid).snapshotChanges().subscribe(data => {
      this.User = data.payload.data() as User;
      if (this.user$.roles.customer === true) {
        this.setPhotoURL();
      } else {
        // this.setStaff();
        // this.site$ = this.siteService.getSitesList();
      }
    });
  }

  setPhotoURL() {
    this.user.patchValue({
      photoURL: this.User.photoURL
    });
  }

}
