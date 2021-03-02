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
  selector: 'edit-ticket',
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
  currentStatus: string
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
    // { name: 'Save as Inform', value: 'Informed' },
    // { name: 'Save as Draft', value: 'Draft' },
    // { name: 'Save as Reject', value: 'Rejected' },
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
      });
      this.moduleList = this.editTicket.controls.site.value.module
    })
    this.site$ = this.siteService.getSitesList()
    this.userService.getStaffsList().snapshotChanges().subscribe(data => {
      this.Staff = [];
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
      assign: ['']
    });
  }

  upadateForm() {
    this.ticketService.editTicket(this.editTicket.value, this.id);
    this.isSubmitAssignDev()
  }

  getMaPackage() {
    const maStartDate = moment(this.editTicket.controls.site.value.maStartDate).format('DD/MM/YYYY');
    const maEndDate = moment(this.editTicket.controls.site.value.maEndDate).format('DD/MM/YYYY');
    return maStartDate + ' - ' + maEndDate;
  }

  displaySelectedStatus(): any {
    return (this.status.value) ? 'Save as ' + this.status.value : 'Save as draft';
  }

  onSelectedStatus(value: any) {
    this.editTicket.patchValue({
      status: value
    });
  }

  filterAction() {
    const currentStatus = this.status.value
    if (currentStatus === 'Draft') {
      this.Status = [
        { name: 'Save as Inform', value: 'Informed' },
        { name: 'Save as In Progress', value: 'In Progress' },
        { name: 'Save as Close', value: 'Closed' },
      ];
    } else if (currentStatus === 'Informed') {
      this.Status = [
        { name: 'Save as Reject', value: 'Rejected' },
        { name: 'Save as In Progress', value: 'In Progress' },
        { name: 'Save as Close', value: 'Closed' },
        { name: 'Save as More Info', value: 'More Info' },
      ];
    } else if (currentStatus === 'Resolved') {
      this.Status = [
        { name: 'Save as Close', value: 'Closed' },
      ];
    } else if (currentStatus === 'In Progress') {
      this.Status = [
        { name: 'Save as Accept', value: 'Accepted' },
        { name: 'Save as Reject', value: 'Rejected' },
        { name: 'Save as Pending', value: 'Pending' },
      ];
    } else if (currentStatus === 'Accepted') {
      this.Status = [
        { name: 'Save as Assign', value: 'Assigned' },
        { name: 'Save as In Progress', value: 'In Progress' },
      ];
    } else if (currentStatus === 'Assigned') {
      this.Status = [
        { name: 'Save as Resolve', value: 'Resolved' },
      ];
    }
  }

  isAssignDev() {
    if (this.editTicket.controls.assign.value) {
      this.onSelectedStatus('Assigned')
    }
  }

  isSubmitAssignDev() {
    if (this.editTicket.controls.assign.value) {
      this.ticketService.setActionById(this.id, this.editTicket.controls.status.value, this.getStaff())
    }
  }

  getStaff(): any {
    return this.editTicket.controls.assign.value.firstName + ' ' + this.editTicket.controls.assign.value.lastName
  }

  isAcceptedAssigned() {
    return this.editTicket.controls.status.value === 'Accepted' || this.editTicket.controls.status.value === 'Assigned'
  }

}