import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.scss']
})
export class Error404Component implements OnInit {
  user
  constructor(
    public auth: AuthService,
  ) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user)
  }

}
