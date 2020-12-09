import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isSignedIn$: Observable<boolean>;

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }
  ngOnInit() {
    this.isSignedIn$ = this.auth.isSignedIn;
  }
}