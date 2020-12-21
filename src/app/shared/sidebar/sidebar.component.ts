import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  user;
  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user)
  }

}
