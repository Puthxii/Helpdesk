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
import {DataService} from "../../services/data/data.service";

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
    public dataService: DataService
  ) { }
  public filterTicketForm: FormGroup
  user: any
  User: User
  user$: any
  creator: string
  isChecked = true
  myOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy'
  }
  status = 'Informed'
  activeState = 'Informed'
  ticket$: Observable<Ticket[]>;
  siteState: string
  CountStatus = []
  statusSpecial = ['In Progress', 'Accepted', 'Assigned']
  statusReject = ['Rejected', 'Pending']
  Status = [
    { value: 'Informed' },
    { value: 'More Info' },
    { value: 'In Progress' },
    { value: 'Accepted', },
    { value: 'Assigned', },
    { value: 'Resolved' },
    { value: 'Rejected' },
    { value: 'Pending' }
  ]
  keyword: string;
  searchValue = '';
  dateRange: IMyDateModel
  private storageCheck: number = 0

  ngOnInit() {
    this.buildForm()
    this.auth.user$.subscribe( user => {
      this.user = user
      this.siteState = this.user.site
      this.User = this.auth.authState;
      this.getCheck()
      this.isFilter()
    });
  }

  setCheck(data: number) {
    localStorage.setItem(String(this.storageCheck), String(data));
    this.getCheck()
  }

  getCheck() {
    const data = Number(localStorage.getItem(String(this.storageCheck)))
    this.isChecked = data === 0;
  }

  buildForm() {
    const model: IMyDateModel = { isRange: true, singleDate: { jsDate: new Date() }, dateRange: null };
    this.filterTicketForm = this.fb.group({
      date: [model, [Validators.required]]
    })
  }

  onDateChanged(event: IMyDateModel): void {
    this.dateRange = event
    const startDate = event.dateRange.beginJsDate
    const endDate = event.dateRange.endJsDate
    if (startDate != null && endDate != null) {
      if (this.isChecked === true && this.status != null && this.keyword != null) {
        this.getByCreatorStatusKeyword(this.creator, this.status, this.keyword, startDate, endDate)
      } else if (this.isChecked === true && this.status != null && this.keyword == null) {
        this.getByCreatorStatus(this.creator, this.status, startDate, endDate)
      } else if (this.isChecked === false && this.status != null && this.keyword != null) {
        this.getBySiteStatusKeyword(this.siteState, this.status, this.keyword, startDate, endDate)
      } else if (this.isChecked === false && this.status != null && this.keyword == null) {
        this.getBySiteStatus(this.siteState, this.status, startDate, endDate)
      }
    }
  }

  getUserValue() {
    this.userService.getUserById(this.User.uid).snapshotChanges().subscribe(data => {
      this.user$ = data.payload.data() as User;
      if (this.user$.roles.customer === true) {
        this.creator = this.user$.uid
        this.siteState = this.user$.site
        this.getCountByStatusCreatorStatus()
        this.status === 'Accepted' ?
          this.getTicketByCreatorSpecialStatus(this.creator, this.statusSpecial) :
          this.status === 'Rejected' ?
            this.getTicketByCreatorSpecialStatus(this.creator, this.statusReject) :
            this.getTicketByCreatorStatus(this.creator, this.status)
      }
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
      this.status === 'Accepted' ?
        this.getBySiteStatusSpecialFilter(this.siteState, this.statusSpecial) :
        this.status === 'Rejected' ?
          this.getBySiteStatusSpecialFilter(this.siteState, this.statusReject) :
          this.getTicketBySiteStatus(this.siteState, this.status)
      this.getCountByStatus()
    }
  }

  getTicketByCreatorSpecialStatus(creator: string, status: string[]) {
    this.ticket$ = this.ticketService.getTicketByCreatorSpecialStatus(creator, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getTicketByCreatorStatus(creator: string, status: string) {
    this.ticket$ = this.ticketService.getTicketByCreatorStatus(creator, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  checkValue(event: boolean) {
    if (event === true) {
      this.setCheck(0)
    } else  {
      this.setCheck(1)
    }
    this.isFilter()
  }

  setStatusState(status: string) {
    this.activeState = status;
  }


  setStatus(status: string) {
    this.setStatusState(status)
    this.status = status
    if (this.searchValue){
      this.search()
    } else if (this.dateRange) {
      this.onDateChanged(this.dateRange)
    } else {
      this.isFilter()
    }
  }

  getSum() {
    return this.CountStatus[2] + this.CountStatus[3] + this.CountStatus[4]
  }

  getSumReject() {
    return this.CountStatus[6] + this.CountStatus[7]
  }

  getStatusName(status: string) {
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
      case 'Resolved': {
        statusString = 'Done'
        break;
      }
      case 'Rejected': {
        statusString = 'Rejected'
        break;
      }
      case 'Pending': {
        statusString = 'Pending'
        break;
      }
    }
    return statusString
  }

  getPriorityIcon(status: string) {
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
      case 'Resolved': {
        classIcon = 'fa-check-circle'
        break;
      }
      case 'Rejected': {
        classIcon = 'fa-times-circle'
        break;
      }
      case 'Pending': {
        classIcon = 'fa-clock'
        break;
      }
    }
    return `fas ${classIcon} mx-2`
  }


  getBackgroundColor(status: string) {
    let classBackground = ''
    switch (status) {
      case 'Informed': {
        classBackground = 'informed-badge'
        break
      }
      case 'More Info': {
        classBackground = 'moreinfo-badge'
        break
      }
      case 'In Progress': {
        classBackground = 'accept-badge'
        break
      }
      case 'Accepted': {
        classBackground = 'accept-badge'
        break
      }
      case 'Assigned': {
        classBackground = 'accept-badge'
        break
      }
      case 'Resolved': {
        classBackground = 'done-badge'
        break;
      }
      case 'Rejected': {
        classBackground = 'reject-badge'
        break;
      }
      case 'Pending': {
        classBackground = 'pending-badge'
        break;
      }
    }
    return `badge ${classBackground} status`
  }

  getCountByStatus() {
    for (let i = 0; this.Status.length > i; i++) {
      this.ticketService.getCountByStatusSite(this.Status[i].value, this.siteState).subscribe(result => {
        this.CountStatus[i] = result.length;
      });
    }
  }

  getBySiteStatusSpecialFilter(site: string, status: string[]) {
    this.ticket$ = this.ticketService.getTicketBySiteSpecialStatus(site, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getTicketBySiteStatus(site: string, status: string) {
    this.ticket$ = this.ticketService.getTicketBySiteStatus(site, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
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

  onSelectedDelete(id: string, subject: string) {
    this.ticketService.cancelTicket(id, subject)
  }

  search() {
    this.keyword = this.searchValue
    if (this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
      if (this.isChecked === true && this.status != null) {
        this.getByKeywordCreatorStatus(this.keyword, this.creator, this.status)
      } else if (this.isChecked === false && this.status != null) {
        this.getByKeywordSiteStatus(this.keyword, this.siteState, this.status)
      }
    } else {
      this.isFilter()
    }
  }

  getByKeywordCreatorStatus(keyword: string, creator: string, status: string) {
    this.ticket$ = this.ticketService.getByKeywordCreatorStatus(keyword, creator, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getByKeywordSiteStatus(keyword: string, site: string, status: string) {
    this.ticket$ = this.ticketService.getByKeywordSiteStatus(keyword, site, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getBySiteStatus(siteState: string, status: string, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getBySiteStatus(siteState, status, startDate, endDate)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  getBySiteStatusKeyword(siteState: string, status: string, keyword: string, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getBySiteStatusKeyword(siteState, status, keyword, startDate, endDate)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  getByCreatorStatus(creator: string, status: string, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByCreatorStatus(creator, status, startDate, endDate)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  getByCreatorStatusKeyword(creator: string, status: string, keyword: string, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByCreatorStatusKeyword(creator, status, keyword, startDate, endDate)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  newPath() {
    this.dataService.changeRedirectSource('site-ticket')
  }
}
