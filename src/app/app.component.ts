import { User } from './models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Component, ElementRef } from '@angular/core';
import { MessagingService } from './services/messaging/messaging.service';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Helpdesk';
  user: User;

  constructor(
    private elementRef: ElementRef,
    public auth: AuthService,
    public msg: MessagingService
  ) {
    this.auth.user$.subscribe(user => this.user = user)
  }

  ngOnInit() {
    this.auth.user$
      .filter(user => !!user)
      .take(1)
      .subscribe(user => {
        this.msg.getPermission(user)
        this.msg.monitorRefresh(user)
        this.msg.receiveMessages()
      })
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#F2EDF3';
  }

}