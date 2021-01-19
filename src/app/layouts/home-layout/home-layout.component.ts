import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css']
})
export class HomeLayoutComponent implements OnInit {
  User: User;
  user;
  user$: any
  AuthService: any;


  constructor(
    private router: Router,
    private auth: AuthService,
    public userService: UserService
  ) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user)
    this.User = this.auth.authState;
    this.getUserValue();
  }

  toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('toggled');
  }

  getUserValue() {
    this.userService.getUserbyId(this.User.uid).snapshotChanges().subscribe(data => {
      this.user$ = data.payload.data() as User;

      // console.log(this.user$);
      // if (this.user$.roles.customer === true) {
      //   this.setPhotoURL();
      // } else {
        // this.setStaff();
        // this.site$ = this.siteService.getSitesList();

      // }
    });
  }

  // setPhotoURL() {
  //   this.User.photoURL;
  // }

}
