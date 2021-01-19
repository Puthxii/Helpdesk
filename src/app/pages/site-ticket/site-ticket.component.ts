import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Ticket } from 'src/app/models/ticket.model';
import { TicketService } from 'src/app/services/ticket/ticket.service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user/user.service';
import { hrtime } from 'process';

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
  myOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy'
  }
  status = 'Draft'
  activeState = 'Draft'
  ticket$: Observable<Ticket[]>;
  siteState
  CountStatus = []
  Status = [
    { value: 'Draft' },
    { value: 'Pending' },
    { value: 'Close' },
    { value: 'Reject' }
  ]

  ngOnInit() {
    this.buildForm()
    this.auth.user$.subscribe(user => this.user = user);
    this.User = this.auth.authState;
    this.isFilter()
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
        this.siteState = this.user$.site
        this.getCountByStatusCreaterStatus()
        this.getTicketByCreaterStatus(this.creater, this.status)
      } else { }
    });
  }

  getCountByStatusCreaterStatus() {
    for (let i = 0; this.Status.length > i; i++) {
      this.ticketService.getCountByStatusCreaterStatus(this.Status[i].value, this.creater).subscribe(result => {
        this.CountStatus[i] = result.length;
      });
    }
  }

  isFilter() {
    if (this.isChecked === true && this.status != null) {
      this.getUserValue()
    } else {
      console.log(this.siteState);
      this.getTicketBySiteStatus(this.siteState, this.status)
      this.getCountByStatus()
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
    this.isFilter()
  }

  setStatusState(status: string) {
    this.activeState = status;
  }

  setStatus(status: string) {
    // this.updateIndex(0)
    this.setStatusState(status)
    this.status = status
    this.isFilter()
  }

  getStatusName(status) {
    let statusString = ''
    switch (status) {
      case 'Draft': {
        statusString = 'Sent'
        break
      }
      case 'Pending': {
        statusString = 'Accept'
        break
      }
      case 'Close': {
        statusString = 'Done'
        break;
      }
      case 'Reject': {
        statusString = 'Reject'
        break;
      }
    }
    return statusString

  }

  getCountByStatus() {
    for (let i = 0; this.Status.length > i; i++) {
      this.ticketService.getCountByStatus(this.Status[i].value).subscribe(result => {
        this.CountStatus[i] = result.length;
      });
    }
  }

  getTicketBySiteStatus(site: any, status: string) {
    this.ticket$ = this.ticketService.getTicketBySiteStatus(site, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }
}
