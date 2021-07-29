import { Ticket } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket/ticket.service';
import { Component, OnInit } from '@angular/core';
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
  selector: 'ticket-sup',
  templateUrl: './ticket-sup.component.html',
  styleUrls: ['./ticket-sup.component.css']
})
export class TicketSupComponent implements OnInit {
  searchValue = '';
  Ticket: Ticket[];
  ticket$: Observable<Ticket[]>;
  ticket: any;
  id: string;
  countAll: number;
  keword = null
  staff: any;
  selectedColor = ''
  priorityClass: string;
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
  Supervisor = ['Accepted', 'Assigned']
  Status = [
    { value: 'Accepted' },
    { value: 'Assigned' },
  ]
  activeState = 'Accepted'
  CountStatus = []
  user: any
  User: User
  user$: any
  isChecked = false
  status = 'Accepted'
  currentName: string
  myOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy'
  }
  private storageCheck: number = 1
  userId: string
  keyword: string;
  private dateRange: IMyDateModel;

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
      this.status === 'Total' ? this.getAllTicket(this.status) : this.getByStatusFilter(this.status)
      this.getCountByRole()
      this.getCountByStatus()
    }
  }

  buildForm() {
    const model: IMyDateModel = { isRange: true, singleDate: { jsDate: new Date() }, dateRange: null };
    this.filterTicketForm = this.fb.group({
      date: [model, [Validators.required]]
    })
  }

  getCurrentUserByRoles() {
    this.userService.getUserById(this.User.uid).snapshotChanges().subscribe(data => {
      this.user$ = data.payload.data() as User
      if (this.user$.roles.supervisor === true) {
        this.currentName = this.user$.firstName + ' ' + this.user$.lastName
        this.userId = this.user$.uid
        this.getCountByUserIdStatus()
        this.getCountByUserIdRole()
        this.status === 'Total' ? this.getAllTicket(this.status) : this.getTicketsListByUserIdStatus(this.userId, this.status)
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

  getCountByUserIdStatus() {
    for (let i = 0; this.Status.length > i; i++) {
      this.ticketService.getCountByUserIdStatus(this.userId, this.Status[i].value).subscribe(result => {
        this.CountStatus[i] = result.length;
      });
    }
  }

  getByStatusFilter(status: string) {
    this.ticket$ = this.ticketService.getTicketsListByStatusFilter(status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getTicketsListByUserIdStatus(userId: string, status: string) {
    this.ticket$ = this.ticketService.getTicketsListByUserIdStatus(userId, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  isDraft(ticket: { status: string; }) {
    return ticket.status === 'Draft';
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

  setStatusState(status: string) {
    this.activeState = status;
  }

  getAllTicket(status: string) {
    this.setStatusState(status)
    this.status = status
    if (this.searchValue){
      this.search()
    } else if (this.dateRange) {
      this.onDateChanged(this.dateRange)
    } else {
      if (this.isChecked === true) {
        this.ticket$ = this.ticketService.getTicketsListByUserIdRole(this.userId, this.Supervisor).snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as Ticket;
            const id = a.payload.doc['id'];
            return { id, ...data };
          }))
        )
      } else {
        this.ticket$ = this.ticketService.getTicketsListByRole(this.Supervisor).snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as Ticket;
            const id = a.payload.doc['id'];
            return { id, ...data };
          }))
        )
      }
    }
  }

  onChange(value: string) {
    this.selectedColor = value;
  }

  checkValue(event: boolean) {
    if (event === true) {
      this.setCheck(0)
    } else  {
      this.setCheck(1)
    }
    this.isFilter()
  }

  getCountByRole() {
    this.ticketService.getTicketsListByRole(this.Supervisor).valueChanges().subscribe(result => {
      this.countAll = result.length;
    });
  }

  getCountByUserIdRole() {
    this.ticketService.getTicketsListByUserIdRole(this.userId, this.Supervisor).valueChanges().subscribe(result => {
      this.countAll = result.length;
    });
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

  getSourcesIcon(sources: any) {
    for (let i = 0; this.Sources.length; i++) {
      if (this.Sources[i].name === sources) {
        return this.Sources[i].icon
      }
    }
  }

  checkDueDate(minDueDate: { seconds: number; }) {
    if (minDueDate) {
      let isDueDate: boolean
      const endDate = new Date(minDueDate.seconds * 1000)
      const currentDate = new Date()
      isDueDate = endDate < currentDate;
      return isDueDate
    }
  }

  newPath() {
    this.dataService.changeRedirectSource('ticket-sup')
  }

  search() {
    this.keyword = this.searchValue
    if (this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
      if (this.isChecked === true && this.status != null && this.status != 'Total') {
        this.getByKeywordUserIdStatus(this.keyword, this.userId, this.status)
      } else if (this.isChecked === false && this.status != null && this.status != 'Total') {
        this.getByKeywordStatus(this.keyword, this.status)
      } else if (this.isChecked === true && this.status === 'Total') {
        this.getByKeywordUserIdRole(this.keyword, this.userId, this.Supervisor)
      } else if (this.isChecked === false && this.status === 'Total') {
        this.getByKeywordRole(this.keyword, this.Supervisor)
      }
    } else {
      this.isFilter()
    }
  }

  getByKeywordUserIdStatus(keyword: string, userId: string, status: any) {
    this.ticket$ = this.ticketService.getByKeywordUserIdStatus(keyword, userId, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return {id, ...data};
        }))
      );
  }

  getByKeywordStatus(keyword: string, status: any) {
    this.ticket$ = this.ticketService.getByKeywordStatus(keyword, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return {id, ...data};
        }))
      );
  }

  getByKeywordUserIdRole(keyword: string, userId: string, role: string[]) {
    this.ticket$ = this.ticketService.getByKeywordUserIdRole(keyword, userId, role)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return {id, ...data};
        }))
      );
  }

  getByKeywordRole(keyword: string, role: string[]) {
    this.ticket$ = this.ticketService.getByKeywordRole(keyword, role)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return {id, ...data};
        }))
      );
  }

  onDateChanged(event: IMyDateModel): void {
    this.dateRange = event
    const startDate = event.dateRange.beginJsDate
    const endDate = event.dateRange.endJsDate
    if (startDate != null && endDate != null) {
      if (this.isChecked === true && this.status != null && this.status !== 'Total' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
        this.getByDateRangeKeywordUserIdStatus(startDate, endDate, this.keyword, this.userId, this.status)
      } else if (this.isChecked === true && this.status != null && this.status !== 'Total' && (this.keyword === undefined || this.keyword === '')) {
        this.getByDateRangeUserIdStatus(startDate, endDate, this.userId, this.status,)
      } else if (this.isChecked === false && this.status != null && this.status !== 'Total' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
        this.getByDateRangeKeywordStatus(startDate, endDate, this.keyword, this.status)
      } else if (this.isChecked === false && this.status != null && this.status !== 'Total' && (this.keyword === undefined || this.keyword === '')) {
        this.getByDateRangeStatus(startDate, endDate, this.status)
      } else if (this.isChecked === true && this.status === 'Total' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
        this.getByDateRangeKeywordUserIdRole(startDate, endDate, this.keyword, this.userId, this.Supervisor)
      } else if (this.isChecked === true && this.status === 'Total' && (this.keyword === undefined || this.keyword === '')) {
        this.getByDateRangeUserIdRole(startDate, endDate, this.userId, this.Supervisor)
      } else if (this.isChecked === false && this.status === 'Total' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
        this.getByDateRangeKeywordRole(startDate, endDate, this.keyword, this.Supervisor)
      } else if (this.isChecked === false && this.status === 'Total' && (this.keyword === undefined || this.keyword === '')) {
        this.getByDateRangeRole(startDate, endDate, this.Supervisor)
      }
    }
  }

  getByDateRangeKeywordUserIdStatus(startDate: Date, endDate: Date, keyword: string, userId: string, status: string) {
    this.ticket$ = this.ticketService.getByDateRangeKeywordUserIdStatus(startDate, endDate, keyword, userId, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return {id, ...data};
        }))
      )
  }

  getByDateRangeUserIdStatus(startDate: Date, endDate: Date, userId: string, status: string) {
    this.ticket$ = this.ticketService.getByDateRangeUserIdStatus(startDate, endDate, userId, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return {id, ...data};
        }))
      )
  }

  getByDateRangeKeywordStatus(startDate: Date, endDate: Date, keyword: string, status: string,) {
    this.ticket$ = this.ticketService.getByDateRangeKeywordStatus(startDate, endDate, keyword, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return {id, ...data};
        }))
      )
  }

  getByDateRangeStatus(startDate: Date, endDate: Date, status: string) {
    this.ticket$ = this.ticketService.getByDateRangeStatus(startDate, endDate, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return {id, ...data};
        }))
      )
  }

  getByDateRangeKeywordUserIdRole(startDate: Date, endDate: Date, keyword: string, userId: string, role: string[]) {
    this.ticket$ = this.ticketService.getByDateRangeKeywordUserIdRole(startDate, endDate, keyword, userId, role)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return {id, ...data};
        }))
      )
  }

  getByDateRangeUserIdRole(startDate: Date, endDate: Date, userId: string, role: string[]) {
    this.ticket$ = this.ticketService.getByDateRangeUserIdRole(startDate, endDate, userId, role)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return {id, ...data};
        }))
      )
  }

  getByDateRangeKeywordRole(startDate: Date, endDate: Date, keyword: string, role: string[]) {
    this.ticket$ = this.ticketService.getByDateRangeKeywordRole(startDate, endDate, keyword, role)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return {id, ...data};
        }))
      )
  }

  getByDateRangeRole(startDate: any, endDate: any, role: string[]) {
    this.ticket$ = this.ticketService.getByDateRangeRole(startDate, endDate, role)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return {id, ...data};
        }))
      )
  }
}
