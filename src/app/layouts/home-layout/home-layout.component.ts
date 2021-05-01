import { TicketService } from 'src/app/services/ticket/ticket.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { MessagingService } from 'src/app/services/messaging/messaging.service';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
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

  constructor(
    private auth: AuthService,
    public userService: UserService,
    public ticketService: TicketService,
    public msg: MessagingService
  ) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user)
    this.User = this.auth.authState;
    this.getUserValue();
    this.auth.user$
      .filter(user => !!user)
      .take(1)
      .subscribe(user => {
        this.msg.getPermission(user)
        this.msg.monitorRefresh(user)
        this.msg.receiveMessages()
      })
  }

  toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('toggled');
  }

  getUserValue() {
    this.userService.getUserbyId(this.User.uid).snapshotChanges().subscribe(data => {
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

}