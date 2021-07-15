import { TicketService } from 'src/app/services/ticket/ticket.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import {DataService} from "../../services/data/data.service";

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
  activeState: any;
  menu: any;
  redirectPath: string
  constructor(
    public auth: AuthService,
    public userService: UserService,
    public ticketService: TicketService,
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user)
    this.dataService.currentRedirect.subscribe(redirectPath => this.redirectPath = redirectPath)
    this.User = this.auth.authState;
    this.getUserValue();
    this.setMenu(this.redirectPath)
  }

  toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('toggled');
  }

  getUserValue() {
    this.userService.getUserById(this.User.uid).snapshotChanges().subscribe(data => {
      this.user$ = data.payload.data() as User;
    })
  }

  setMenuState(menu: any) {
    this.activeState = menu;
  }

  setMenu(menu: any) {
    this.setMenuState(menu)
    this.menu = menu
  }

  newPath() {
    if (this.user.roles.customer === true) {
      this.dataService.changeRedirectSource('site-ticket')
    }else if (this.user.roles.supporter === true){
      this.dataService.changeRedirectSource('ticket')
    }
  }

}
