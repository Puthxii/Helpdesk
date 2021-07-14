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
  selector: 'ticket-dev',
  templateUrl: './ticket-dev.component.html',
  styleUrls: ['./ticket-dev.component.css']
})
export class TicketDevComponent implements OnInit {
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

  Status = [
    { value: 'Assigned' },
    { value: 'Resolved' }
  ]

  Developer = ['Assigned', 'Resolved']

  activeState = 'Assigned'
  CountStatus = []
  user: any
  User: User
  user$: any
  isChecked = true
  status = 'Assigned'
  currentName: string
  myOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy'
  }
  private storageCheck: number = 0
  userId: string

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
      if (this.user$.roles.developer === true) {
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
    this.isFilter()
  }

  setStatusState(status: string) {
    this.activeState = status;
  }

  getAllTicket(status: string) {
    this.setStatusState(status)
    this.status = status
    if (this.isChecked === true) {
      this.ticket$ = this.ticketService.getTicketsListByUserIdRole(this.userId, this.Developer).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
    } else {
      this.ticket$ = this.ticketService.getTicketsList(this.Developer).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
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

  getCountToltal() {
    this.ticketService.getTicketsList(this.Developer).valueChanges().subscribe(result => {
      this.countAll = result.length;
    });
  }

  getCountByUserIdRole() {
    this.ticketService.getTicketsListByUserIdRole(this.userId, this.Developer).valueChanges().subscribe(result => {
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
    this.dataService.changeRedirectSource('ticket-dev')
  }
}
