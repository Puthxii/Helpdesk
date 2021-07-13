import { Ticket } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket/ticket.service';
import {Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user/user.service';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Inject } from '@angular/core';
import {DataService} from "../../services/data/data.service";

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
  searchValue = '';
  Ticket: Ticket[];
  ticket$: Observable<Ticket[]>;
  ticket: any;
  id: string;
  countAll: number;
  staff: any;
  selectedColor = ''
  priorityClass: string;
  statusSpecial = ['In Progress', 'Accepted', 'Assigned']
  keyword: string;
  constructor(
    @Inject('PRIORITY') public Prioritys: any[],
    @Inject('TYPES') public Types: any[],
    @Inject('STATUS') public CurrentStatus: any[],
    @Inject('SOURCES') public Sources: any[],
    private auth: AuthService,
    private ticketService: TicketService,
    public userService: UserService,
    public fb: FormBuilder,
    public dataService: DataService
  ) { }

  public filterTicketForm: FormGroup
  activeState = 'Draft'
  Supporter = ['Draft', 'Informed', 'More Info', 'In Progress', 'Accepted', 'Assigned', 'Resolved']
  Status = [
    { value: 'Draft' },
    { value: 'Informed' },
    { value: 'More Info' },
    { value: 'In Progress' },
    { value: 'Accepted', },
    { value: 'Assigned', },
    { value: 'Resolved' },
  ]
  CountStatus = []
  user: any
  User: User
  user$: any
  isChecked = true
  status = 'Draft'
  currentName: string
  userId: string
  myOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy'
  }
  private storageCheck: number = 0

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user);
    this.User = this.auth.authState;
    this.buildForm()
    this.getCheck()
    this.isFilter()
  }

  setCheck(data: number) {
    localStorage.setItem(String(this.storageCheck), String(data));
    this.getCheck()
  }

  getCheck() {
    const data = Number(localStorage.getItem(String(this.storageCheck)))
    this.isChecked = data === 0;
  }

  isFilter() {
    if (this.isChecked === true) {
      this.getCurrentUserByRoles()
    } else {
      this.status === 'Total' ?
        this.getAllTicket(this.status) :
        this.status === 'In Progress' ?
          this.getByStatusSpecialFilter(this.statusSpecial) :
          this.getByStatusFilter(this.status)
      this.getCountByStatus()
      this.getCountToltal()
    }
  }

  buildForm() {
    const model: IMyDateModel = { isRange: true, singleDate: { jsDate: new Date() }, dateRange: null };
    this.filterTicketForm = this.fb.group({
      date: [model, [Validators.required]]
    })
  }

  getCurrentUserByRoles() {
    this.userService.getUserbyId(this.User.uid).snapshotChanges().subscribe(data => {
      this.user$ = data.payload.data() as User
      if (this.user$.roles.supporter === true) {
        this.currentName = this.user$.fullName
        this.userId = this.user$.uid
        this.getCountByStatusCurrentname()
        this.getCountToltalCurrentname()
        this.status === 'Total' ?
          this.getAllTicket(this.status) :
          this.status === 'In Progress' ?
            this.getByStatusCurentnameSpecialFilter(this.statusSpecial, this.currentName) :
            this.getByStatusCurentnameFilter(this.status, this.currentName)
      } else { }
    });
  }

  getCountByStatus() {
    for (let i = 0; this.Status.length > i; i++) {
      this.ticketService.getCountByStatus(this.Status[i].value).subscribe(result => {
        this.CountStatus[i] = result.length;
      });
    }
  }

  getSum() {
    let sum: number
    sum = this.CountStatus[3] + this.CountStatus[4] + this.CountStatus[5]
    return sum ? sum : null
  }

  getCountByStatusCurrentname() {
    for (let i = 0; this.Status.length > i; i++) {
      this.ticketService.getCountByStatusCurrentname(this.Status[i].value, this.currentName).subscribe(result => {
        this.CountStatus[i] = result.length;
      });
    }
  }

  getCountToltal() {
    this.ticketService.getTicketsList(this.Supporter).valueChanges().subscribe(result => {
      this.countAll = result.length;
    });
  }

  getCountToltalCurrentname() {
    this.ticketService.getTicketsListCurrentname(this.currentName, this.Supporter).valueChanges().subscribe(result => {
      this.countAll = result.length;
    });
  }

  getByStatusFilter(status: any) {
    this.ticket$ = this.ticketService.getTicketsListByStatusFilter(status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getByStatusSpecialFilter(status: any) {
    this.ticket$ = this.ticketService.getTicketsListByStatusSpecialFilter(status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getByStatusCurentnameSpecialFilter(status: any, creator: string) {
    this.ticket$ = this.ticketService.getTicketsListByCreatorSpecialStatus(status, creator)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getByStatusCurentnameFilter(status: any, creator: string) {
    this.ticket$ = this.ticketService.getTicketsListByFilter(status, creator)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  onSelectedDelete(id: any, subject: any) {
    this.ticketService.cancelTicket(id, subject)
  }

  getByKeywordUserIdStatus(keyword: string, userId: string, status: any) {
    this.ticket$ = this.ticketService.getByKeywordUserIdStatus(keyword, userId, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getByKeywordUserIdStatusSpacial(keyword: string, userId: string, status: any) {
    this.ticket$ = this.ticketService.getByKeywordUserIdStatusSpacial(keyword, userId, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getByKeywordStatus(keyword: string, status: any) {
    this.ticket$ = this.ticketService.getByKeywordStatus(keyword, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getByKeywordStatusSpacial(keyword: string, status: any) {
    this.ticket$ = this.ticketService.getByKeywordStatusSpacial(keyword, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getByKeywordUserIdRole(keyword: string, userId: string, role: string[]) {
    this.ticket$ = this.ticketService.getByKeywordUserIdRole(keyword, userId, role)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getByKeywordRole(keyword: string, role: string[]) {
    this.ticket$ = this.ticketService.getByKeywordRole(keyword, role)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  search() {
    this.keyword = this.searchValue
    if (this.keyword !== undefined && this.keyword !== null && this.keyword !== ''){
      if (this.isChecked === true && this.status != null && this.status != 'Total') {
        this.getByKeywordUserIdStatus(this.keyword, this.userId, this.status)
      } else if (this.isChecked === false && this.status != null && this.status != 'Total') {
        this.getByKeywordStatus(this.keyword, this.status)
      } if (this.isChecked === true && this.status != null && this.status === 'In Progress') {
        this.getByKeywordUserIdStatusSpacial(this.keyword, this.userId, this.statusSpecial)
      } else if (this.isChecked === false && this.status != null && this.status === 'In Progress') {
        this.getByKeywordStatusSpacial(this.keyword, this.statusSpecial)
      } else if (this.isChecked === true && this.status === 'Total') {
        this.getByKeywordUserIdRole(this.keyword, this.userId, this.Supporter)
      } else if (this.isChecked === false && this.status === 'Total') {
        this.getByKeywordRole(this.keyword, this.Supporter)
      }
    } else {
      this.isFilter()
    }
  }

  isDraft(ticket: { status: any; }) {
    return ticket.status === 'Draft';
  }

  isStatusSpecail(ticket) {
    return ticket.status !== 'In Progress' && ticket.status !== 'Assigned' && ticket.status !== 'Accepted';
  }

  setStatus(status: any) {
    this.setStatusState(status)
    this.status = status
    this.isFilter()
  }

  getAllTicket(status: any) {
    this.setStatusState(status)
    this.status = status
    if (this.isChecked === true) {
      this.ticket$ = this.ticketService.getTicketsListCurrentname(this.currentName, this.Supporter).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
    } else {
      this.ticket$ = this.ticketService.getTicketsList(this.Supporter).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
    }
  }

  setStatusState(status: any) {
    this.activeState = status;
  }

  getSourcesIcon(sources: any) {
    for (let i = 0; this.Sources.length; i++) {
      if (this.Sources[i].name === sources) {
        return this.Sources[i].icon
      }
    }
  }

  getPriorityIcon(priority: any) {
    for (let i = 0; this.Prioritys.length; i++) {
      if (this.Prioritys[i].name === priority) {
        return this.Prioritys[i].icon
      }
    }
  }

  getTypeIcon(type: any) {
    for (let i = 0; this.Types.length; i++) {
      if (this.Types[i].name === type) {
        return this.Types[i].icon
      }
    }
  }

  getStatusIcon(status: any) {
    for (let i = 0; this.CurrentStatus.length; i++) {
      if (this.CurrentStatus[i].name === status) {
        return this.CurrentStatus[i].icon
      }
    }
  }

  checkValue(event: boolean) {
    if (event === true) {
      this.setCheck(0)
    } else  {
      this.setCheck(1)
    }
    this.isFilter()
  }

  onDateChanged(event: IMyDateModel): void {
    const startDate = event.dateRange.beginJsDate
    const endDate = event.dateRange.endJsDate
    if (startDate != null && endDate != null) {
      if (this.isChecked === true && this.status != null && this.status !== 'Total' && this.status !== 'In Progress' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
        this.getByCurrentnameStatusKewordDateRange(this.keyword, this.currentName, this.status, startDate, endDate)
      } else if (this.isChecked === true && this.status != null && this.status !== 'Total' && this.status !== 'In Progress' && (this.keyword === undefined || this.keyword === '')) {
        this.getByCurrentnameStatusDateRange(this.currentName, this.status, startDate, endDate)
      } else if (this.isChecked === false && this.status != null && this.status !== 'Total' && this.status !== 'In Progress' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
        this.getByStatusKewordDateRange(this.keyword, this.status, startDate, endDate)
      } else if (this.isChecked === false && this.status != null && this.status !== 'Total' && this.status !== 'In Progress' && (this.keyword === undefined || this.keyword === '')) {
        this.getByStatusDateRange(this.status, startDate, endDate)
      } else if (this.isChecked === true && this.status === 'Total' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
        this.getByCurrentnameKewordDateRange(this.keyword, this.currentName, startDate, endDate)
      } else if (this.isChecked === true && this.status === 'Total' && (this.keyword === undefined || this.keyword === '')) {
        this.getByCurrentnameDateRange(this.currentName, startDate, endDate)
      } else if (this.isChecked === false && this.status === 'Total' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
        this.getByKewordDaterange(this.keyword, startDate, endDate)
      } else if (this.isChecked === false && this.status === 'Total' && (this.keyword === undefined || this.keyword === ''))  {
        this.getByDaterange(startDate, endDate)
      } else if (this.isChecked === true && this.status === 'In Progress' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
        this.getByCurrentnameKewordDateRangeSpacail(this.keyword, this.currentName, startDate, endDate)
      } else if (this.isChecked === true && this.status === 'In Progress' && (this.keyword === undefined || this.keyword === '')) {
        this.getByCurrentnameDateRangeSpacail(this.currentName, startDate, endDate)
      } else if (this.isChecked === false && this.status === 'In Progress' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
        this.getByKeywordDateRangeSpacail(this.keyword, this.statusSpecial, startDate, endDate)
      } else if (this.isChecked === false && this.status === 'In Progress' && (this.keyword === undefined || this.keyword === '')) {
        this.getByDateRangeSpacail(this.statusSpecial, startDate, endDate)
      }
    }
  }

  getByCurrentnameStatusKewordDateRange(keword: any, currentName: string, status: any, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByCurrentnameStatusKewordDateRange(keword, currentName, status, startDate, endDate)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  getByCurrentnameStatusDateRange(currentName: string, status: any, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByCurrentnameStatusDateRange(currentName, status, startDate, endDate)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  getByStatusKewordDateRange(keword: any, status: any, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByStatusKewordDateRange(keword, status, startDate, endDate)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  getByStatusDateRange(status: any, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByStatusDateRange(status, startDate, endDate)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  getByCurrentnameKewordDateRange(keword: any, currentName: string, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByCurrentnameKewordDateRange(keword, currentName, startDate, endDate, this.Supporter)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  getByCurrentnameKewordDateRangeSpacail(keyword: any, currentName: string, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByCurrentnameKewordDateRange(keyword, currentName, startDate, endDate, this.statusSpecial)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  getByCurrentnameDateRange(currentName: string, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByCurrentnameDateRange(currentName, startDate, endDate, this.Supporter)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  getByCurrentnameDateRangeSpacail(currentName: string, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByCurrentnameDateRange(currentName, startDate, endDate, this.statusSpecial)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  getByKewordDaterange(keword: any, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByKewordDaterange(keword, startDate, endDate, this.Supporter)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  getByDaterange(startDate: any, endDate: any) {
    this.ticket$ = this.ticketService.getByDaterange(startDate, endDate, this.Supporter).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Ticket;
        const id = a.payload.doc['id'];
        return { id, ...data };
      }))
    )
  }

  onChange(value: string) {
    this.selectedColor = value;
  }

  classPriority(priority: any) {
    let color = ''
    switch (priority) {
      case 'Low': {
        color = 'low'
        break
      }
      case 'Medium': {
        color = 'medium'
        break
      }
      case 'High': {
        color = 'high'
        break;
      }
      case 'Critical': {
        color = 'critical'
        break;
      }
      case 'Undefined': {
        color = 'undefined'
      }
    }
    return `${color}`
  }

  checkDuedete(maxDueDate: { seconds: number; }) {
    if (maxDueDate) {
      let isDuedate: boolean
      const endDate = new Date(maxDueDate.seconds * 1000)
      const currentDate = new Date()
      isDuedate = endDate < currentDate;
      return isDuedate
    }
  }

  newPath() {
    this.dataService.changeRedirectSource('ticket')
  }

  updateMoreInfo(id) {
    this.ticketService.updateMoreInfo(id, false)
  }

  private getByKeywordDateRangeSpacail(keyword: string, statusSpecail: string[], startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByKeywordDateRangeSpacail(keyword, startDate, endDate, statusSpecail)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  private getByDateRangeSpacail(statusSpecail: string[], startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByDateRangeSpacail(startDate, endDate, statusSpecail)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }
}
