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
  private dateRange: IMyDateModel;

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
  ) {
  }

  public filterTicketForm: FormGroup
  activeState = 'Draft'
  Supporter = ['Draft', 'Informed', 'More Info', 'In Progress', 'Accepted', 'Assigned', 'Resolved']
  Status = [
    {value: 'Draft'},
    {value: 'Informed'},
    {value: 'More Info'},
    {value: 'In Progress'},
    {value: 'Accepted',},
    {value: 'Assigned',},
    {value: 'Resolved'},
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
      this.getCountByRole()
    }
  }

  buildForm() {
    const model: IMyDateModel = {isRange: true, singleDate: {jsDate: new Date()}, dateRange: null};
    this.filterTicketForm = this.fb.group({
      date: [model, [Validators.required]]
    })
  }

  getCurrentUserByRoles() {
    this.userService.getUserById(this.User.uid).snapshotChanges().subscribe(data => {
      this.user$ = data.payload.data() as User
      if (this.user$.roles.supporter === true) {
        this.currentName = this.user$.fullName
        this.userId = this.user$.uid
        this.getCountByUserIdStatus()
        this.getCountByUserIdRole()
        this.status === 'Total' ?
          this.getAllTicket(this.status) :
          this.status === 'In Progress' ?
            this.getTicketsListByUserIdStatusSpecial(this.userId, this.statusSpecial) :
            this.getTicketsListByUserIdStatus(this.userId, this.status)
      } else {
      }
    });
  }

  getCountByStatus() {
    for (let i = 0; this.Status.length > i; i++) {
      this.ticketService.getCountByStatus(this.Status[i].value).subscribe(result => {
        this.CountStatus[i] = result.length;
      });
    }
  }

  getCountByRole() {
    this.ticketService.getTicketsListByRole(this.Supporter).valueChanges().subscribe(result => {
      this.countAll = result.length;
    });
  }

  getCountByUserIdStatus() {
    for (let i = 0; this.Status.length > i; i++) {
      this.ticketService.getCountByUserIdStatus(this.userId, this.Status[i].value).subscribe(result => {
        this.CountStatus[i] = result.length;
      });
    }
  }

  getCountByUserIdRole() {
    this.ticketService.getTicketsListByUserIdRole(this.userId, this.Supporter).valueChanges().subscribe(result => {
      this.countAll = result.length;
    });
  }

  getSum() {
    let sum: number
    sum = this.CountStatus[3] + this.CountStatus[4] + this.CountStatus[5]
    return sum ? sum : 0
  }

  getByStatusFilter(status: any) {
    this.ticket$ = this.ticketService.getTicketsListByStatusFilter(status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return {id, ...data};
        }))
      );
  }

  getByStatusSpecialFilter(role: string[]) {
    this.ticket$ = this.ticketService.getTicketsListByRole(role)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return {id, ...data};
        }))
      );
  }

  getTicketsListByUserIdStatusSpecial(userId: string, role: string[]) {
    this.ticket$ = this.ticketService.getTicketsListByUserIdRole(userId, role)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return {id, ...data};
        }))
      );
  }

  getTicketsListByUserIdStatus(status: any, creator: string) {
    this.ticket$ = this.ticketService.getTicketsListByUserIdStatus(status, creator)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return {id, ...data};
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
          return {id, ...data};
        }))
      );
  }

  getByKeywordUserIdStatusSpacial(keyword: string, userId: string, status: any) {
    this.ticket$ = this.ticketService.getByKeywordUserIdStatusSpacial(keyword, userId, status)
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

  getByKeywordStatusSpacial(keyword: string, status: any) {
    this.ticket$ = this.ticketService.getByKeywordStatusSpacial(keyword, status)
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

  search() {
    this.keyword = this.searchValue
    if (this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
      if (this.isChecked === true && this.status != null && this.status != 'Total') {
        this.getByKeywordUserIdStatus(this.keyword, this.userId, this.status)
      } else if (this.isChecked === false && this.status != null && this.status != 'Total') {
        this.getByKeywordStatus(this.keyword, this.status)
      } else if (this.isChecked === true && this.status != null && this.status === 'In Progress') {
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

  isStatusSpecial(ticket) {
    return ticket.status !== 'In Progress' && ticket.status !== 'Assigned' && ticket.status !== 'Accepted';
  }

  setStatus(status: any) {
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

  getAllTicket(status: any) {
    this.setStatusState(status)
    this.status = status
    if (this.searchValue){
      this.search()
    }  else if (this.dateRange) {
      this.onDateChanged(this.dateRange)
    }else {
      if (this.isChecked === true) {
        this.ticket$ = this.ticketService.getTicketsListByUserIdRole(this.userId, this.Supporter).snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as Ticket;
            const id = a.payload.doc['id'];
            return {id, ...data};
          }))
        )
      } else {
        this.ticket$ = this.ticketService.getTicketsListByRole(this.Supporter).snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as Ticket;
            const id = a.payload.doc['id'];
            return {id, ...data};
          }))
        )
      }
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
    } else {
      this.setCheck(1)
    }
    this.search()
  }

  onDateChanged(event: IMyDateModel): void {
    this.dateRange = event
    const startDate = event.dateRange.beginJsDate
    const endDate = event.dateRange.endJsDate
    if (startDate != null && endDate != null) {
      if (this.isChecked === true && this.status != null && this.status !== 'Total' && this.status !== 'In Progress' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
        this.getByDateRangeKeywordUserIdStatus(startDate, endDate, this.keyword, this.userId, this.status)
      } else if (this.isChecked === true && this.status != null && this.status !== 'Total' && this.status !== 'In Progress' && (this.keyword === undefined || this.keyword === '')) {
        this.getByDateRangeUserIdStatus(startDate, endDate, this.userId, this.status,)
      } else if (this.isChecked === false && this.status != null && this.status !== 'Total' && this.status !== 'In Progress' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
        this.getByDateRangeKeywordStatus(startDate, endDate, this.keyword, this.status)
      } else if (this.isChecked === false && this.status != null && this.status !== 'Total' && this.status !== 'In Progress' && (this.keyword === undefined || this.keyword === '')) {
        this.getByDateRangeStatus(startDate, endDate, this.status)
      } else if (this.isChecked === true && this.status === 'Total' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
        this.getByDateRangeKeywordUserIdRole(startDate, endDate, this.keyword, this.userId, this.Supporter)
      } else if (this.isChecked === true && this.status === 'Total' && (this.keyword === undefined || this.keyword === '')) {
        this.getByDateRangeUserIdRole(startDate, endDate, this.userId, this.Supporter)
      } else if (this.isChecked === false && this.status === 'Total' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
        this.getByDateRangeKeywordRole(startDate, endDate, this.keyword, this.Supporter)
      } else if (this.isChecked === false && this.status === 'Total' && (this.keyword === undefined || this.keyword === '')) {
        this.getByDateRangeRole(startDate, endDate, this.Supporter)
      } else if (this.isChecked === true && this.status === 'In Progress' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
        this.getByDateRangeKeywordUserIdRole(startDate, endDate, this.keyword, this.userId, this.statusSpecial)
      } else if (this.isChecked === true && this.status === 'In Progress' && (this.keyword === undefined || this.keyword === '')) {
        this.getByDateRangeUserIdRole(startDate, endDate, this.userId, this.statusSpecial)
      } else if (this.isChecked === false && this.status === 'In Progress' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
        this.getByDateRangeKeywordRole(startDate, endDate, this.keyword, this.statusSpecial)
      } else if (this.isChecked === false && this.status === 'In Progress' && (this.keyword === undefined || this.keyword === '')) {
        this.getByDateRangeRole(startDate, endDate, this.statusSpecial)
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

  checkDueDate(maxDueDate: { seconds: number; }) {
    if (maxDueDate) {
      let isDueDate: boolean
      const endDate = new Date(maxDueDate.seconds * 1000)
      const currentDate = new Date()
      isDueDate = endDate < currentDate;
      return isDueDate
    }
  }

  newPath() {
    this.dataService.changeRedirectSource('ticket')
  }

  updateMoreInfo(id) {
    this.ticketService.updateMoreInfo(id, false)
  }

  private getNewCount() {
    this.ticket$.subscribe(res => {
      res.map(value => {
        for (let i = 0; this.Status.length > i; i++) {
          if (value.status === this.Status[i].value){
            this.CountStatus[i] = res.length
          }
        }
      })
    })
  }
}
