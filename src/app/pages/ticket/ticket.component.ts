import { async } from '@angular/core/testing';
import { Ticket } from './../../services/ticket/ticket.model';
import { TicketService } from './../../services/ticket/ticket.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/services/user.model';
import { UserService } from 'src/app/services/user/user.service';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

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
  max: number;
  keword = null
  staff: any;
  selectedColor = '';

  colors = [
    {
      name: 'yellow',
      value: '#ffff00'
    },
    {
      name: 'red',
      value: '#ff3300'
    },
    {
      name: 'blue',
      value: '#0000ff'
    }
  ];
  priorityClass: string;
  constructor(
    private auth: AuthService,
    private ticketService: TicketService,
    public userService: UserService,
    public fb: FormBuilder,

  ) { }

  public filterTicketForm: FormGroup
  activeState = 'Draft'
  Status = [
    { value: 'Draft' },
    { value: 'More Info' },
    { value: 'Pending' },
    { value: 'Resolved' },
    { value: 'Close' }
  ]
  ActiveStatus = [
    { name: 'Pending' },
    { name: 'Close' }
  ]
  CountStatus = []

  Types = [
    { name: 'Info', icon: 'fas fa-info-circle mx-2'},
    { name: 'Consult', icon: 'fas fa-question-circle mx-2' },
    { name: 'Problem', icon: 'fas fa-exclamation-circle mx-2' },
    { name: 'Add-ons', icon: 'fas fa-plus-circle mx-2' }
  ];
  data = [
    {
      name: 'Low',
      value: '#2ED0B9'
    },
    {
      name: 'Medium',
      value: '#FFBE96'
    },
    {
      name: 'High',
      value: '#FE8896'
    },
    {
      name: 'Critical',
      value: '#FE8896'
    }
  ];

  Prioritys = [
    { name: 'Low', icon: 'fas fa-square mx-2', value: `btn-secondary` },
    { name: 'Medium', icon: 'fas fa-circle mx-2', value: `btn-success`},
    { name: 'High', icon: 'fas fa-star mx-2', value: `btn-secondary`},
    { name: 'Critical', icon: 'fas fa-fire mx-2', value: `btn-secondary`}
  ];

  Sources = [
    { icon: 'fas fa-globe-americas', name: 'Website' },
    { icon: 'fab fa-line', name: 'Line' },
    { icon: 'fas fa-envelope', name: 'Email' },
    { icon: 'fas fa-phone', name: 'Telephone' },
    { icon: 'fas fa-user-friends', name: 'Onsite' },
    { icon: 'fab fa-facebook-square', name: 'Facebook' }
  ];

  startIndex = 0;
  endIndex = 7;
  tabindex = 0;

  user: any
  User: User
  user$: any
  isChecked = true
  status = 'Draft'
  currentName: string

  myOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy'
  }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user);
    this.User = this.auth.authState;
    this.buildForm()
    this.isFilter()
  }

  isFilter() {
    if (this.isChecked === true) {
      this.getCurrentUserByRoles()
    } else {
      this.status === 'All' ? this.getAllTicket(this.status) : this.getByStatusFilter(this.status)
      this.getCountByStatus()
      this.getCountToltal()
      this.search()
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
        this.currentName = this.user$.firstName + ' ' + this.user$.lastName
        this.getCountByStatusCurrentname()
        this.getCountToltalCurrentname()
        this.status === 'All' ? this.getAllTicket(this.status) : this.getByStatusCurentnameFilter(this.status, this.currentName)
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

  getCountByStatusCurrentname() {
    for (let i = 0; this.Status.length > i; i++) {
      this.ticketService.getCountByStatusCurrentname(this.Status[i].value, this.currentName).subscribe(result => {
        this.CountStatus[i] = result.length;
      });
    }
  }

  getCountToltal() {
    this.ticketService.getTicketsList().valueChanges().subscribe(result => {
      this.countAll = result.length;
    });
  }

  getCountToltalCurrentname() {
    this.ticketService.getTicketsListCurrentname(this.currentName).valueChanges().subscribe(result => {
      this.countAll = result.length;
    });
  }

  getByStatusFilter(status: string) {
    this.ticket$ = this.ticketService.getTicketsListByStatusFilter(status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  getByStatusCurentnameFilter(status: string, creater: string) {
    this.ticket$ = this.ticketService.getTicketsListByFilter(status, creater)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  onSelectedDelete(id, subject: any) {
    this.ticketService.cancelTicket(id, subject)
  }

  changeStatus(id, status: any, staff: any) {
    this.ticketService.changeStatus(id, status, staff)
  }

  changePriority(id, priority: string) {
    this.priorityClass = priority
    this.ticketService.changePriority(id, priority)
  }

  changeType(id, type: string) {
    this.ticketService.changeType(id, type)
  }

  getByKeyWord(value: string) {
    this.ticket$ = this.ticketService.getByKeyWord(value)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }


  getByCurrentnameStatus(value, currentname, status) {
    this.ticket$ = this.ticketService.getByCurrentnameStatus(value, currentname, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  getByStatus(value, status) {
    this.ticket$ = this.ticketService.getByStatus(value, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  getByCurrentname(value: string, currentName: string) {
    this.ticket$ = this.ticketService.getByCurrentname(value, currentName)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  search() {
    this.keword = this.searchValue
    this.updateIndex(0)
    if (this.isChecked === true && this.status != null && this.status != 'All') {
      this.getByCurrentnameStatus(this.keword, this.currentName, this.status)
    } else if (this.isChecked === false && this.status != null && this.status != 'All') {
      this.getByStatus(this.keword, this.status)
    } else if (this.isChecked === true && this.status === 'All') {
      this.getByCurrentname(this.keword, this.currentName)
    } else if (this.isChecked === false && this.status === 'All') {
      this.getByKeyWord(this.keword)
    }
  }

  isDraft(ticket) {
    return ticket.status === 'Draft';
  }

  setStatus(status: string) {
    this.updateIndex(0)
    this.setStatusState(status)
    this.status = status
    this.isFilter()
  }

  getAllTicket(status: string) {
    this.setStatusState(status)
    this.status = status
    if (this.isChecked === true) {
      this.ticket$ = this.ticketService.getTicketsListCurrentname(this.currentName).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      )
    } else {
      this.ticket$ = this.ticketService.getTicketsList().snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      )
    }
  }

  setStatusState(status: string) {
    this.activeState = status;
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

  checkValue(event: any) {
    this.isFilter()
  }

  onDateChanged(event: IMyDateModel): void {
    const startDate = event.dateRange.beginJsDate
    const endDate = event.dateRange.endJsDate
    alert(this.isChecked + ' ' + this.status + ' ' + this.keword + ' ' + this.currentName + ' ' + startDate)
    this.updateIndex(0)
    if (startDate != null && endDate != null) {
      if (this.isChecked === true && this.status != null && this.status !== 'All' && this.keword != null) {
        this.getByCurrentnameStatusKewordDateRange(this.keword, this.currentName, this.status, startDate, endDate)
      } else if (this.isChecked === true && this.status != null && this.status !== 'All' && this.keword == null) {
        this.getByCurrentnameStatusDateRange(this.currentName, this.status, startDate, endDate)
      } else if (this.isChecked === false && this.status != null && this.status !== 'All' && this.keword != null) {
        this.getByStatusKewordDateRange(this.keword, this.status, startDate, endDate)
      } else if (this.isChecked === false && this.status != null && this.status !== 'All' && this.keword == null) {
        this.getByStatusDateRange(this.status, startDate, endDate)
      } else if (this.isChecked === true && this.status === 'All' && this.keword != null) {
        this.getByCurrentnameKewordDateRange(this.keword, this.currentName, startDate, endDate)
      } else if (this.isChecked === true && this.status === 'All' && this.keword == null) {
        this.getByCurrentnameDateRange(this.currentName, startDate, endDate)
      } else if (this.isChecked === false && this.status === 'All' && this.keword != null) {
        this.getByKewordDaterange(this.keword, startDate, endDate)
      } else if (this.isChecked === false && this.status === 'All' && this.keword == null) {
        this.getByDaterange(startDate, endDate)
      }
    }
  }

  getByCurrentnameStatusKewordDateRange(keword: any, currentName: string, status: string, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByCurrentnameStatusKewordDateRange(keword, currentName, status, startDate, endDate)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      )
  }

  getByCurrentnameStatusDateRange(currentName: string, status: string, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByCurrentnameStatusDateRange(currentName, status, startDate, endDate)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      )
  }

  getByStatusKewordDateRange(keword: any, status: string, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByStatusKewordDateRange(keword, status, startDate, endDate)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      )
  }

  getByStatusDateRange(status: string, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByStatusDateRange(status, startDate, endDate)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      )
  }

  getByCurrentnameKewordDateRange(keword: any, currentName: string, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByCurrentnameKewordDateRange(keword, currentName, startDate, endDate)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      )
  }

  getByCurrentnameDateRange(currentName: string, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByCurrentnameDateRange(currentName, startDate, endDate)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      )
  }

  getByKewordDaterange(keword: any, startDate: Date, endDate: Date) {
    this.ticket$ = this.ticketService.getByKewordDaterange(keword, startDate, endDate)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      )
  }

  getByDaterange(startDate: any, endDate: any) {
    this.ticket$ = this.ticketService.getByDaterange(startDate, endDate).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Ticket;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    )
  }

  getCurrentStaff() {
    return this.staff = this.currentName
  }

  onChange(value) {
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
   }
    return `btn dropdown-toggle ${color}`
  }
}
