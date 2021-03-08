import { SiteService } from './../../services/site/site.service';
import { Site } from '../../models/site.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Observable } from 'rxjs/internal/Observable';
import { Ticket } from 'src/app/models/ticket.model';
import { TicketService } from 'src/app/services/ticket/ticket.service';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import * as moment from 'moment';
import { Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css']
})
export class EditTicketComponent implements OnInit {
  site$: Observable<any>;
  dropdownSettings: IDropdownSettings;
  id: string;
  ticket$: Observable<Ticket>;
  public editTicket: FormGroup;
  moduleList: any[];
  Site: Site[];
  user
  Staff: User[];
  staff: any;
  statusCurrent: any;
  currentName: string
  Sources = [
    { name: 'Facebook', },
    { name: 'Website' },
    { name: 'Line' },
    { name: 'Email' },
    { name: 'Telephone' },
    { name: 'Onsite' }
  ];

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

  Status = [
    { name: 'Save as Draft', value: 'Draft' },
    { name: 'Save as Inform', value: 'Informed' },
    { name: 'Save as More Info', value: 'More Info' },
    { name: 'Save as In Progress', value: 'In Progress' },
    { name: 'Save as Accept', value: 'Accepted' },
    { name: 'Save as Assign', value: 'Assigned' },
    { name: 'Save as Resolve', value: 'Resolved' },
  ];

  ticket: any;

  myOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy'
  };

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private siteService: SiteService,
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private auth: AuthService,
    public userService: UserService,
  ) {
    this.route.params.subscribe(params => this.id = params.id)
  }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user)
    this.upadateTicketForm()
    this.ticketService.getTicketByid(this.id).subscribe(data => {
      this.ticket = data
      this.editTicket.patchValue({
        date: this.ticket.date,
        source: this.ticket.source,
        site: this.ticket.site,
        product: this.ticket.site.product.name,
        module: this.ticket.module,
        creator: this.ticket.creator,
        type: this.ticket.type,
        subject: this.ticket.subject,
        priority: this.ticket.priority,
        description: this.ticket.description,
        resolveDescription: this.ticket.resolveDescription,
        status: this.ticket.status,
        staff: this.ticket.staff,
        siteName: this.ticket.site.nameEN,
        assign: this.ticket.assign,
        currentStatus: this.ticket.status
      });
    })
    this.site$ = this.siteService.getSitesList()
    this.userService.getStaffsList().snapshotChanges().subscribe(data => {
      this.Staff = []
      data.map(items => {
        const item = items.payload.doc.data();
        item['$uid'] = items.payload.doc.id;
        this.Staff.push(item as User)
      })
    });
  }

  getCreate() {
    return this.editTicket.controls.site.value.users;
  }

  get date() {
    return this.editTicket.get('date')
  }

  get source() {
    return this.editTicket.get('source');
  }

  get site() {
    return this.editTicket.get('site');
  }

  get maintenancePackage() {
    return this.editTicket.get('maintenancePackage');
  }

  get module() {
    return this.editTicket.get('module');
  }

  get creator() {
    return this.editTicket.get('creator');
  }

  get type() {
    return this.editTicket.get('type');
  }

  get subject() {
    return this.editTicket.get('subject');
  }

  get priority() {
    return this.editTicket.get('priority');
  }

  get description() {
    return this.editTicket.get('description');
  }

  get resolveDescription() {
    return this.editTicket.get('resolveDescription');
  }

  get status() {
    return this.editTicket.get('status');
  }

  get assign() {
    return this.editTicket.get('assign');
  }

  upadateTicketForm() {
    const model: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() }, dateRange: null };
    this.editTicket = this.fb.group({
      date: [model, [Validators.required]],
      source: ['', [Validators.required]],
      site: [''],
      module: [''],
      creator: ['', [Validators.required]],
      type: ['', [Validators.required]],
      subject: ['', [
        Validators.required,
        Validators.maxLength(50)]
      ],
      priority: ['', [Validators.required]],
      description: ['', [
        Validators.required,
        Validators.maxLength(500)]
      ],
      resolveDescription: [''],
      status: [''],
      staff: [''],
      product: [''],
      siteName: [''],
      maintenancePackage: [''],
      assign: [''],
      currentStatus: ['']
    });
  }

  upadateForm() {
    this.ticketService.editTicket(this.editTicket.value, this.id);
    this.isSubmitAssignDev()
    console.log( this.ticket.format(this.date), this.ticket.status, this.ticket.assign);
  }

  getMaPackage() {
    const maStartDate = moment(this.editTicket.controls.site.value.maStartDate).format('DD/MM/YYYY');
    const maEndDate = moment(this.editTicket.controls.site.value.maEndDate).format('DD/MM/YYYY');
    return maStartDate + ' - ' + maEndDate;
  }

  displaySelectedStatus(): any {
    return (this.status.value) ? this.mathStatus(this.status.value) : 'Save as draft';
  }

  mathStatus(status: string): string {
    for (let i = 0; this.Status.length; i++) {
      if (this.Status[i].value === status) {
        return this.Status[i].name
      }
    }
  }

  onSelectedStatus(value: any) {
    this.editTicket.patchValue({
      status: value
    });
  }

  filterAction() {
    const currentStatus = this.editTicket.controls.currentStatus.value
    if (currentStatus === 'Draft') {
      this.removeStatus('Accepted');
      this.removeStatus('Assigned');
      this.removeStatus('Resolved');
      this.removeStatus('Close');
      this.isCloseInProgress()
    } else if (currentStatus === 'Informed') {
      this.addStatus('More Info');
      this.addStatus('Rejected');
      this.removeStatus('Accepted');
      this.removeStatus('Assigned');
      this.removeStatus('Resolved');
      this.isCloseInProgress()
      this.removeStatus('Draft');
      this.removeStatus('Assigned');
    } else if (currentStatus === 'More Info') {
      this.addStatus('More Info');
      this.addStatus('Informed');
      this.addStatus('Rejected');
      this.isCloseInProgress()
      this.removeStatus('Draft');
      this.removeStatus('Accepted');
      this.removeStatus('Assigned');
      this.removeStatus('Resolved');
    } else if (currentStatus === 'In Progress') {
      this.addStatus('Accepted');
      this.addStatus('Rejected');
      this.isConsult()
      this.removeStatus('Draft');
      this.removeStatus('Informed');
      this.removeStatus('More Info');
      this.removeStatus('Assigned');
      this.removeStatus('Resolved');
    } else if (currentStatus === 'Accepted') {
      this.addStatus('Assigned');
      this.removeStatus('Draft');
      this.removeStatus('Informed');
      this.removeStatus('More Info');
      this.removeStatus('Resolved');
    } else if (currentStatus === 'Assigned') {
      this.removeStatus('Draft');
      this.removeStatus('Informed');
      this.removeStatus('More Info');
      this.removeStatus('In Progress');
      this.removeStatus('Accepted');
      this.addStatus('Resolved');
    } else if (currentStatus === 'Resolved') {
      this.removeStatus('Draft');
      this.removeStatus('Informed');
      this.removeStatus('More Info');
      this.removeStatus('In Progress');
      this.removeStatus('Accepted');
      this.removeStatus('Assigned');
      this.addStatus('Closed');
    }
  }

  isConsult() {
    if (this.editTicket.controls.type.value === 'Add-ons') {
      this.addStatus('Pending');
    } else {
      this.removeStatus('Pending');
    }
  }

  isCloseInProgress() {
    if (this.editTicket.controls.type.value === 'Info' || this.editTicket.controls.type.value === 'Consult') {
      this.removeStatus('In Progress');
      this.isResolveDescription(Event)
    } else if (this.editTicket.controls.type.value === 'Problem' || this.editTicket.controls.type.value === 'Add-ons') {
      this.removeStatus('Closed');
      this.addStatus('In Progress');
    }
  }

  isAssignDev() {
    (this.editTicket.controls.assign.value) ? this.onSelectedStatus('Assigned') : this.onSelectedStatus('Accepted')
  }

  isSubmitAssignDev() {
    if (this.editTicket.controls.assign.value) {
      this.ticketService.setActionById(this.id, this.editTicket.controls.status.value, this.editTicket.controls.assign.value)
    }
  }

  isAcceptedAssigned() {
    return this.editTicket.controls.status.value === 'Accepted' || this.editTicket.controls.status.value === 'Assigned'
  }

  isSelectedType() {
    return (this.editTicket.controls.type.value === 'Info' || this.editTicket.controls.type.value === 'Consult')
  }

  isResolveDescription(event: any) {
    (this.editTicket.controls.resolveDescription.value) ? this.addStatus('Closed') : this.removeStatus('Closed')
  }

  removeStatus(status: string) {
    this.Status = this.Status.filter(item => item.value !== status)
  }

  addStatus(status: string) {
    if (this.Status.some(item => item.value === status)) {
      console.log('Object found inside the array.');
    } else {
      let name: string;
      let value: string;
      switch (status) {
        case 'Draft':
          name = 'Save as Draft'
          value = status
          break;
        case 'Informed':
          name = 'Save as Inform'
          value = status
          break;
        case 'More Info':
          name = 'Save as More Info'
          value = status
          break;
        case 'In Progress':
          name = 'Save as In Progress'
          value = status
          break;
        case 'Accepted':
          name = 'Save as Accept'
          value = status
          break;
        case 'Assigned':
          name = 'Save as Assign'
          value = status
          break;
        case 'Resolved':
          name = 'Save as Resolve'
          value = status
          break;
        case 'Rejected':
          name = 'Save as Reject'
          value = status
          break;
        case 'Closed':
          name = 'Save as Close'
          value = status
          break;
        default:
          name = `Save as ${status}`
          value = status
          break;
      }
      return this.Status.push({ name, value })
    }
  }

  // addActionSentence() {
  //   if (this.staff === 'supervisor' ) {
  //     console.log('assign to dev');
  //  } else {
  //     console.log('error');
  //  }
  // }

}
