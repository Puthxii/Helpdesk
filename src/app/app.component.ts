import { User } from './models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Component, ElementRef } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Helpdesk';
  user: User;

  constructor(private elementRef: ElementRef, public auth: AuthService) {
    this.auth.user$.subscribe(user => this.user = user)
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#F2EDF3';
  }
}