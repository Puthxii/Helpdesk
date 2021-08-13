import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-error500',
  templateUrl: './error500.component.html',
  styleUrls: ['./error500.component.scss']
})
export class Error500Component implements OnInit {
  user
  constructor(
    public auth: AuthService,
  ) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user)
  }


}
