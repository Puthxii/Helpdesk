import { Component, Inject, OnInit } from '@angular/core';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { User } from 'src/app/models/user.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { Ticket } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket/ticket.service';
import { DataService } from '../../services/data/data.service';
import { SiteService } from 'src/app/services/site/site.service';
import { Site } from 'src/app/models/site.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  private storageCheck = 0
  public filterTicketForm: FormGroup
  User: User
  user: User
  ticket$: Observable<Ticket[]>;
  isChecked = true
  status = 'All'
  site = 'All'
  keyword: string;
  myOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy'
  }
  dateRange: IMyDateModel = null;
  History = ['Draft', 'Informed', 'More Info', 'In Progress', 'Accepted', 'Assigned', 'Resolved', 'Closed', 'Rejected', 'Pending']
  currentName: string;
  userId: string;
  Site: Site[];
  initialsSite = [];

  constructor(
    @Inject('STATUS') public CurrentStatus: any[],
    @Inject('PRIORITY') public Priorities: any[],
    @Inject('TYPES') public Types: any[],
    @Inject('SOURCES') public Sources: any[],
    private auth: AuthService,
    public fb: FormBuilder,
    private ticketService: TicketService,
    public dataService: DataService,
    private siteService: SiteService
  ) {
  }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user);
    this.User = this.auth.authState;
    this.getSitesList()
    this.removeStatus('All')
    this.CurrentStatus.push({ name: 'All', icon: '-' })
    this.buildForm()
    this.getCheck()
    this.isFilter()
  }

  getSitesList() {
    this.siteService.getSites().snapshotChanges().subscribe(data => {
      this.Site = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$key'] = items.payload.doc['id'];
        this.Site.push(item as Site)
      })
      this.setSiteInitials()
    });
  }

  setSiteInitials() {
    this.initialsSite = []
    this.Site.forEach(item => {
      this.initialsSite.push(item.initials)
    });
    this.removeSite('All')
    this.initialsSite.push('All')
  }

  removeSite(name: string) {
    this.initialsSite = this.initialsSite.filter(item => item !== name)
  }

  removeStatus(name: string) {
    this.CurrentStatus = this.CurrentStatus.filter(item => item.name !== name)
  }

  private isFilter() {
    if (this.isChecked === true) {
      this.getCurrentUserByRoles()
    } else {
      this.status === 'All' ? this.getAllTicket(this.status) : this.getByStatusFilter(this.status)
    }
  }

  checkValue(isChecked: boolean) {
    if (isChecked === true) {
      this.setCheck(0)
    } else {
      this.setCheck(1)
    }
    this.search()
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

  displaySelectedStatus() {
    return (this.status != 'All') ? this.status : 'Select status';
  }

  onSelectedStatus(name) {
    this.status = name
    if (this.keyword) {
      this.search()
    } else if (this.dateRange) {
      this.onDateChanged(this.dateRange)
    } else if (this.site != 'All') {
      this.onSelectedSite(this.site)
    } else {
      this.isFilter()
    }
  }

  displaySelectedSite() {
    return (this.site != 'All') ? this.site : 'Select site';
  }

  onSelectedSite(site: string) {
    this.site = site
    if (this.site != 'All') {
      if (this.dateRange != null) {
        if (this.isChecked === true && this.status != null && this.status !== 'All' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
          this.getBySiteDateRangeKeywordUserIdStatus(this.site, this.keyword, this.userId, this.status, this.dateRange)
        } else if (this.isChecked === true && this.status != null && this.status !== 'All' && (this.keyword === undefined || this.keyword === '')) {
          this.getBySiteDateRangeUserIdStatus(this.site, this.userId, this.status, this.dateRange)
        } else if (this.isChecked === false && this.status != null && this.status !== 'All' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
          this.getBySiteDateRangeKeywordStatus(this.site, this.keyword, this.status, this.dateRange)
        } else if (this.isChecked === false && this.status != null && this.status !== 'All' && (this.keyword === undefined || this.keyword === '')) {
          this.getBySiteDateRangeStatus(this.site, this.status, this.dateRange)
        } else if (this.isChecked === true && this.status === 'All' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
          this.getBySiteDateRangeKeywordUserIdRole(this.site, this.keyword, this.userId, this.History, this.dateRange)
        } else if (this.isChecked === true && this.status === 'All' && (this.keyword === undefined || this.keyword === '')) {
          this.getBySiteDateRangeUserIdRole(this.site, this.userId, this.History, this.dateRange)
        } else if (this.isChecked === false && this.status === 'All' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
          this.getBySiteDateRangeKeywordRole(this.site, this.keyword, this.History, this.dateRange)
        } else if (this.isChecked === false && this.status === 'All' && (this.keyword === undefined || this.keyword === '')) {
          this.getBySiteDateRangeRole(this.site, this.History, this.dateRange)
        }
      } else {
        if (this.isChecked === true && this.status != null && this.status !== 'All' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
          this.getBySiteKeywordUserIdStatus(this.site, this.keyword, this.userId, this.status)
        } else if (this.isChecked === true && this.status != null && this.status !== 'All' && (this.keyword === undefined || this.keyword === '')) {
          this.getBySiteUserIdStatus(this.site, this.userId, this.status)
        } else if (this.isChecked === false && this.status != null && this.status !== 'All' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
          this.getBySiteKeywordStatus(this.site, this.keyword, this.status)
        } else if (this.isChecked === false && this.status != null && this.status !== 'All' && (this.keyword === undefined || this.keyword === '')) {
          this.getBySiteStatus(this.site, this.status)
        } else if (this.isChecked === true && this.status === 'All' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
          this.getBySiteKeywordUserIdRole(this.site, this.keyword, this.userId, this.History)
        } else if (this.isChecked === true && this.status === 'All' && (this.keyword === undefined || this.keyword === '')) {
          this.getBySiteUserIdRole(this.site, this.userId, this.History)
        } else if (this.isChecked === false && this.status === 'All' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
          this.getBySiteKeywordRole(this.site, this.keyword, this.History)
        } else if (this.isChecked === false && this.status === 'All' && (this.keyword === undefined || this.keyword === '')) {
          this.getBySiteRole(this.site, this.History)
        }
      }
    } else {
      this.search()
    }
  }

  clear() {
    this.dateRange = null
    this.search()
  }

  search() {
    if (this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
      if (this.isChecked === true && this.status != null && this.status != 'All') {
        this.getByKeywordUserIdStatus(this.keyword, this.userId, this.status)
      } else if (this.isChecked === false && this.status != null && this.status != 'All') {
        this.getByKeywordStatus(this.keyword, this.status)
      } else if (this.isChecked === true && this.status === 'All') {
        this.getByKeywordUserIdRole(this.keyword, this.userId, this.History)
      } else if (this.isChecked === false && this.status === 'All') {
        this.getByKeywordRole(this.keyword, this.History)
      }
    } else if (this.site != 'All') {
      this.onSelectedSite(this.site)
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

  onDateChanged(event: IMyDateModel) {
    this.dateRange = event
    const startDate = event.dateRange.beginJsDate
    const endDate = event.dateRange.endJsDate
    if (this.site != 'All') {
      this.onSelectedSite(this.site)
    } else if (startDate != null && endDate != null) {
      if (this.isChecked === true && this.status != null && this.status !== 'All' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
        this.getByDateRangeKeywordUserIdStatus(startDate, endDate, this.keyword, this.userId, this.status)
      } else if (this.isChecked === true && this.status != null && this.status !== 'All' && (this.keyword === undefined || this.keyword === '')) {
        this.getByDateRangeUserIdStatus(startDate, endDate, this.userId, this.status,)
      } else if (this.isChecked === false && this.status != null && this.status !== 'All' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
        this.getByDateRangeKeywordStatus(startDate, endDate, this.keyword, this.status)
      } else if (this.isChecked === false && this.status != null && this.status !== 'All' && (this.keyword === undefined || this.keyword === '')) {
        this.getByDateRangeStatus(startDate, endDate, this.status)
      } else if (this.isChecked === true && this.status === 'All' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
        this.getByDateRangeKeywordUserIdRole(startDate, endDate, this.keyword, this.userId, this.History)
      } else if (this.isChecked === true && this.status === 'All' && (this.keyword === undefined || this.keyword === '')) {
        this.getByDateRangeUserIdRole(startDate, endDate, this.userId, this.History)
      } else if (this.isChecked === false && this.status === 'All' && this.keyword !== undefined && this.keyword !== null && this.keyword !== '') {
        this.getByDateRangeKeywordRole(startDate, endDate, this.keyword, this.History)
      } else if (this.isChecked === false && this.status === 'All' && (this.keyword === undefined || this.keyword === '')) {
        this.getByDateRangeRole(startDate, endDate, this.History)
      }
    }
  }

  getByDateRangeKeywordUserIdStatus(startDate: Date, endDate: Date, keyword: string, userId: string, status: string) {
    this.ticket$ = this.ticketService.getByDateRangeKeywordUserIdStatus(startDate, endDate, keyword, userId, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  getByDateRangeUserIdStatus(startDate: Date, endDate: Date, userId: string, status: string) {
    this.ticket$ = this.ticketService.getByDateRangeUserIdStatus(startDate, endDate, userId, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  getByDateRangeKeywordStatus(startDate: Date, endDate: Date, keyword: string, status: string,) {
    this.ticket$ = this.ticketService.getByDateRangeKeywordStatus(startDate, endDate, keyword, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  getByDateRangeStatus(startDate: Date, endDate: Date, status: string) {
    this.ticket$ = this.ticketService.getByDateRangeStatus(startDate, endDate, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  getByDateRangeKeywordUserIdRole(startDate: Date, endDate: Date, keyword: string, userId: string, role: string[]) {
    this.ticket$ = this.ticketService.getByDateRangeKeywordUserIdRole(startDate, endDate, keyword, userId, role)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  getByDateRangeUserIdRole(startDate: Date, endDate: Date, userId: string, role: string[]) {
    this.ticket$ = this.ticketService.getByDateRangeUserIdRole(startDate, endDate, userId, role)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  getByDateRangeKeywordRole(startDate: Date, endDate: Date, keyword: string, role: string[]) {
    this.ticket$ = this.ticketService.getByDateRangeKeywordRole(startDate, endDate, keyword, role)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  getByDateRangeRole(startDate: any, endDate: any, role: string[]) {
    this.ticket$ = this.ticketService.getByDateRangeRole(startDate, endDate, role)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      )
  }

  private getCurrentUserByRoles() {
    this.currentName = this.User.fullName
    this.userId = this.User.uid
    this.status === 'All' ? this.getAllTicket(this.status) : this.getTicketsListByUserIdStatus(this.userId, this.status)
  }

  private getByStatusFilter(status: string) {
    this.ticket$ = this.ticketService.getTicketsListByStatusFilter(status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  private getAllTicket(status: string) {
    if (this.keyword) {
      this.search()
    } else if (this.dateRange) {
      this.onDateChanged(this.dateRange)
    } else if (this.site != 'All') {
      this.onSelectedSite(this.site)
    } else {
      if (this.isChecked === true) {
        this.ticket$ = this.ticketService.getTicketsListByUserIdRole(this.userId, this.History).snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as Ticket;
            const id = a.payload.doc['id'];
            return { id, ...data };
          }))
        )
      } else {
        this.ticket$ = this.ticketService.getTicketsListByRole(this.History).snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as Ticket;
            const id = a.payload.doc['id'];
            return { id, ...data };
          }))
        )
      }
    }
  }

  private getTicketsListByUserIdStatus(userId: string, status: string) {
    this.ticket$ = this.ticketService.getTicketsListByUserIdStatus(userId, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  classPriority(priority: string) {
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

  getPriorityIcon(priority: string) {
    for (let i = 0; this.Priorities.length; i++) {
      if (this.Priorities[i].name === priority) {
        return this.Priorities[i].icon
      }
    }
  }

  getTypeIcon(type: string) {
    for (let i = 0; this.Types.length; i++) {
      if (this.Types[i].name === type) {
        return this.Types[i].icon
      }
    }
  }

  getStatusIcon(status: string) {
    for (let i = 0; this.CurrentStatus.length; i++) {
      if (this.CurrentStatus[i].name === status) {
        return this.CurrentStatus[i].icon
      }
    }
  }

  getSourcesIcon(source: string) {
    for (let i = 0; this.Sources.length; i++) {
      if (this.Sources[i].name === source) {
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

  isDraft(ticket: Ticket) {
    return ticket.status === 'Draft';
  }

  onSelectedDelete(id: any, subject: string) {
    this.ticketService.cancelTicket(id, subject)
  }

  newPath() {
    this.dataService.changeRedirectSource('history')
  }

  updateMoreInfo(id: any) {
    this.ticketService.updateMoreInfo(id, false)
  }

  getBySiteRole(site: string, History: string[]) {
    this.ticket$ = this.ticketService.getBySiteRole(site, History)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getBySiteKeywordRole(site: string, keyword: string, History: string[]) {
    this.ticket$ = this.ticketService.getBySiteKeywordRole(site, keyword, History)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getBySiteUserIdRole(site: string, userId: string, History: string[]) {
    this.ticket$ = this.ticketService.getBySiteUserIdRole(site, userId, History)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getBySiteKeywordUserIdRole(site: string, keyword: string, userId: string, History: string[]) {
    this.ticket$ = this.ticketService.getBySiteKeywordUserIdRole(site, keyword, userId, History)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getBySiteStatus(site: string, status: string) {
    this.ticket$ = this.ticketService.getBySiteStatus(site, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getBySiteKeywordStatus(site: string, keyword: string, status: string) {
    this.ticket$ = this.ticketService.getBySiteKeywordStatus(site, keyword, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getBySiteUserIdStatus(site: string, userId: string, status: string) {
    this.ticket$ = this.ticketService.getBySiteUserIdStatus(site, userId, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getBySiteKeywordUserIdStatus(site: string, keyword: string, userId: string, status: string) {
    this.ticket$ = this.ticketService.getBySiteKeywordUserIdStatus(site, keyword, userId, status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getBySiteDateRangeRole(site: string, History: string[], dateRange: IMyDateModel) {
    this.ticket$ = this.ticketService.getBySiteDateRangeRole(site, History, dateRange)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getBySiteDateRangeKeywordRole(site: string, keyword: string, History: string[], dateRange: IMyDateModel) {
    this.ticket$ = this.ticketService.getBySiteDateRangeKeywordRole(site, keyword, History, dateRange)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getBySiteDateRangeUserIdRole(site: string, userId: string, History: string[], dateRange: IMyDateModel) {
    this.ticket$ = this.ticketService.getBySiteDateRangeUserIdRole(site, userId, History, dateRange)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getBySiteDateRangeKeywordUserIdRole(site: string, keyword: string, userId: string, History: string[], dateRange: IMyDateModel) {
    this.ticket$ = this.ticketService.getBySiteDateRangeKeywordUserIdRole(site, keyword, userId, History, dateRange)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getBySiteDateRangeStatus(site: string, status: string, dateRange: IMyDateModel) {
    this.ticket$ = this.ticketService.getBySiteDateRangeStatus(site, status, dateRange)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getBySiteDateRangeKeywordStatus(site: string, keyword: string, status: string, dateRange: IMyDateModel) {
    this.ticket$ = this.ticketService.getBySiteDateRangeKeywordStatus(site, keyword, status, dateRange)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getBySiteDateRangeUserIdStatus(site: string, userId: string, status: string, dateRange: IMyDateModel) {
    this.ticket$ = this.ticketService.getBySiteDateRangeUserIdStatus(site, userId, status, dateRange)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

  getBySiteDateRangeKeywordUserIdStatus(site: string, keyword: string, userId: string, status: string, dateRange: IMyDateModel) {
    this.ticket$ = this.ticketService.getBySiteDateRangeKeywordUserIdStatus(site, keyword, userId, status, dateRange)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc['id'];
          return { id, ...data };
        }))
      );
  }

}
