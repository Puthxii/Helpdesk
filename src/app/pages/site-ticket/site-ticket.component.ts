import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Ticket } from 'src/app/services/ticket/ticket.model';
import { TicketService } from 'src/app/services/ticket/ticket.service';
import { User } from 'src/app/services/user.model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-site-ticket',
  templateUrl: './site-ticket.component.html',
  styleUrls: ['./site-ticket.component.css']
})
export class SiteTicketComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    private auth: AuthService,
    public userService: UserService,
    private ticketService: TicketService,
  ) { }
  public filterTicketForm: FormGroup
  user: any
  User: User
  user$: any
  creater: any
  isChecked = true
  max: number;
  startIndex = 0;
  endIndex = 7;
  tabindex = 0;
  myOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy'
  }
  status = 'Draft'
  ticket$: Observable<Ticket[]>;

  ngOnInit() {
    this.buildForm()
    this.auth.user$.subscribe(user => this.user = user);
    this.User = this.auth.authState;
    this.getUserValue()
  }

  buildForm() {
    const model: IMyDateModel = { isRange: true, singleDate: { jsDate: new Date() }, dateRange: null };
    this.filterTicketForm = this.fb.group({
      date: [model, [Validators.required]]
    })
  }

  onDateChanged(event: IMyDateModel): void {
    const startDate = event.dateRange.beginJsDate
    const endDate = event.dateRange.endJsDate
  }

  getUserValue() {
    this.userService.getUserbyId(this.User.uid).snapshotChanges().subscribe(data => {
      this.user$ = data.payload.data() as User;
      if (this.user$.roles.customer === true) {
        this.creater = this.user$.firstName + ' ' + this.user$.lastName
        this.isFilter()
      } else { }
    });
  }

  isFilter() {
    if (this.isChecked === true && this.status != null) {
      this.getTicketByCreaterStatus(this.creater, this.status)
    }
  }

  getTicketByCreaterStatus(creater: any, status: string) {
    this.ticket$ = this.ticketService.getTicketByCreaterStatus(creater, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  checkValue(event: any) {
  }
  
  getArrayFromNumber(length) {
    this.max = (Math.ceil(length / 7))
    return new Array(Math.ceil(this.max));
  }
  
  updateIndex(pageIndex) {
    this.startIndex = pageIndex * 7;
    this.endIndex = this.startIndex + 7;
  }

  previousIndex() {
    if (this.tabindex > 0) {
      this.tabindex -= 1
    }
    this.startIndex = this.tabindex * 7;
    this.endIndex = this.startIndex + 7;
  }

  nextIndex() {
    if (this.tabindex < this.max - 1) {
      this.tabindex += 1
    }
    this.startIndex = this.tabindex * 7;
    this.endIndex = this.startIndex + 7;

  }
}