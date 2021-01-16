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
  constructor(
    private auth: AuthService,
    private ticketService: TicketService,
    public userService: UserService,
    public fb: FormBuilder,

  ) { }

  public filterTicketForm: FormGroup;
  searchValue = ''
  Ticket: Ticket[]
  ticket$: Observable<Ticket[]>
  ticket: any
  id: string
  countAll: number
  activeState = 'Draft'
  Status = [
    { value: 'Draft' },
    { value: 'More Info' },
    { value: 'Pending' },
    { value: 'Resolved' },
    { value: 'Close' }
  ]

  CountStatus = []

  Types = [
    { name: 'Info' },
    { name: 'Consult' },
    { name: 'Problem' },
    { name: 'Add-ons' }
  ];

  Prioritys = [
    { name: 'Low' },
    { name: 'Medium' },
    { name: 'High' },
    { name: 'Critical' }
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
      alert(this.status)
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
        console.log(this.user$.roles.supporter)
        this.currentName = this.user$.firstName + ' ' + this.user$.lastName
        if (this.currentName != null && this.status != null) {
          alert('current + status')
          this.getCountByStatusCurrentname()
          this.getCountToltalCurrentname()
          this.getByStatusCurentnameFilter(this.status, this.currentName)
        } else if (this.status != null) {
          alert('status')
          this.getByStatusFilter(this.status)
        }
      } else {
        console.log('other');
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

  onSelectedDelete(id) {
    this.ticketService.cancelTicket(id)
  }

  onChangeStatusPending(id) {
    this.ticketService.changeStatusPendingById(id)
  }

  changeStatusCloseById(id) {
    this.ticketService.changeStatusPendingById(id)
  }

  getBySearch(value) {
    this.ticket$ = this.ticketService.getByKeyWord(value)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  search() {
    const value = this.searchValue;
    value ? this.getBySearch(value) : this.getByStatusCurentnameFilter('Draft', this.currentName)
  }

  isDraft(ticket) {
    return ticket.status === 'Draft';
  }

  setStatus(status: string) {
    this.setStatusState(status)
    this.status = status
    this.isFilter()
  }

  getAllTicket(status: string) {
    this.setStatusState(status)
    this.ticket$ = this.ticketService.getTicketsList().snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Ticket;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  setStatusState(status: string) {
    this.activeState = status;
  }

  getArrayFromNumber(length) {
    return new Array(Math.ceil(length / 7));
  }

  updateIndex(pageIndex) {
    this.startIndex = pageIndex * 7;
    this.endIndex = this.startIndex + 7;
  }

  getIcon(sources: any) {
    for (let i = 0; this.Sources.length; i++) {
      if (this.Sources[i].name === sources) {
        return this.Sources[i].icon
      }
    }
  }

  checkValue(event: any) {
    this.isChecked
    this.isFilter()
  }
}
