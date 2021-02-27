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
  creator: any
  isChecked = true
  max: number;
  myOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy'
  }
  status = 'Informed'
  activeState = 'Informed'
  ticket$: Observable<Ticket[]>;
  siteState: any
  CountStatus = []
  Status = [
    { value: 'Informed' },
    { value: 'More Info' },
    { value: 'In Progress' },
    { value: 'Accepted', },
    { value: 'Assigned', },
    { value: 'Closed' },
    { value: 'Rejected' }
  ]
  keword = null
  searchValue = '';

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
    if (startDate != null && endDate != null) {
      if (this.isChecked === true && this.status != null && this.keword != null) {
        this.getByCreatorStatusKeword(this.creator, this.status, this.keword, startDate, endDate)
      } else if (this.isChecked === true && this.status != null && this.keword == null) {
        this.getByCreatorStatus(this.creator, this.status, startDate, endDate)
      } else if (this.isChecked === false && this.status != null && this.keword != null) {
        this.getBySiteStatusKeword(this.siteState, this.status, this.keword, startDate, endDate)
      } else if (this.isChecked === false && this.status != null && this.keword == null) {
        this.getBySiteStatus(this.siteState, this.status, startDate, endDate)
      }
    }

  }

  getUserValue() {
    this.userService.getUserbyId(this.User.uid).snapshotChanges().subscribe(data => {
      this.user$ = data.payload.data() as User;
      if (this.user$.roles.customer === true) {
        this.creator = this.user$.firstName + ' ' + this.user$.lastName
        this.siteState = this.user$.site
        this.getCountByStatusCreatorStatus()
        this.getTicketByCreatorStatus(this.creator, this.status)
      } else { }
    });
  }

  getCountByStatusCreatorStatus() {
    for (let i = 0; this.Status.length > i; i++) {
      this.ticketService.getCountByStatusCreatorStatus(this.Status[i].value, this.creator).subscribe(result => {
        this.CountStatus[i] = result.length;
      });
    }
  }

  isFilter() {
    if (this.isChecked === true && this.status != null) {
      this.getUserValue()
    } else {
      this.getTicketBySiteStatus(this.siteState, this.status)
      this.getCountByStatus()
    }
  }

  getTicketByCreatorStatus(creator: any, status: string) {
    this.ticket$ = this.ticketService.getTicketByCreatorStatus(creator, status)
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
    this.setStatusState(status)
    this.status = status
    this.isFilter()
  }

  getSum() {
    return this.CountStatus[2] + this.CountStatus[3] + this.CountStatus[4]
  }

  getStatusName(status: any) {
    let statusString = ''
    switch (status) {
      case 'Informed': {
        statusString = 'Sent'
        break
      }
      case 'More Info': {
        statusString = 'More Info'
        break
      }
      case 'In Progress': {
        statusString = 'Accepted'
        break
      }
      case 'Accepted': {
        statusString = 'Accepted'
        break
      }
      case 'Assigned': {
        statusString = 'Accepted'
        break
      }
      case 'Closed': {
        statusString = 'Done'
        break;
      }
      case 'Rejected': {
        statusString = 'Rejected'
        break;
      }
    }
    return statusString
  }

  getPriorityIcon(status: any) {
    let classIcon = ''
    switch (status) {
      case 'Informed': {
        classIcon = 'fa-pen'
        break
      }
      case 'More Info': {
        classIcon = 'fa-file'
        break
      }
      case 'In Progress': {
        classIcon = 'fa-clock'
        break
      }
      case 'Accepted': {
        classIcon = 'fa-clock'
        break
      }
      case 'Assigned': {
        classIcon = 'fa-clock'
        break
      }
      case 'Closed': {
        classIcon = 'fa-check-circle'
        break;
      }
      case 'Rejected': {
        classIcon = 'fa-times-circle'
        break;
      }
    }
    return `fas ${classIcon} mx-2`
  }


  getBackgroundColor(status: any) {
    let classBackground = ''
    switch (status) {
      case 'Informed': {
        classBackground = 'informed'
        break
      }
      case 'More Info': {
        classBackground = 'moreinfo'
        break
      }
      case 'In Progress': {
        classBackground = 'accept'
        break
      }
      case 'Closed': {
        classBackground = 'done'
        break;
      }
      case 'Rejected': {
        classBackground = 'reject'
        break;
      }
    }
    return `badge ${classBackground} status`
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

  isDraft(ticket: { status: string; }) {
    return ticket.status === 'Informed';
  }

  isInformedMoreInfo(ticket: { status: string; }) {
    return ticket.status === 'Informed' || ticket.status === 'More Info';
  }

  onSelectedDelete(id: any, subject: any) {
    this.ticketService.cancelTicket(id, subject)
  }

  search() {
    this.keword = this.searchValue
    if (this.isChecked === true && this.status != null) {
      this.getByKewordCreatorStatus(this.keword, this.creator, this.status)
    } else if (this.isChecked === false && this.status != null) {
      this.getByKewordSiteStatus(this.keword, this.siteState, this.status)
    }
  }

  getByKewordCreatorStatus(keword: any, creator: any, status: string) {
    this.ticket$ = this.ticketService.getByKewordCreatorStatus(keword, creator, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  getByKewordSiteStatus(keword: any, site: any, status: string) {
    this.ticket$ = this.ticketService.getByKewordSiteStatus(keword, site, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  getBySiteStatus(siteState: any, status: string, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getBySiteStatus(siteState, status, startDate, endDate)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      )
  }

  getBySiteStatusKeword(siteState: any, status: string, keword: any, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getBySiteStatusKeword(siteState, status, keword, startDate, endDate)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      )
  }

  getByCreatorStatus(creator: any, status: string, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByCreatorStatus(creator, status, startDate, endDate)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      )
  }

  getByCreatorStatusKeword(creator: any, status: string, keword: any, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByCreatorStatusKeword(creator, status, keword, startDate, endDate)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      )
  }
}