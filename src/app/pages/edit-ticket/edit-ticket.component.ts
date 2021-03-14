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
  user: User
  Staff: User[];
  staff: any;
  statusCurrent: any;
  currentName: string
  user$: any

  Sources = [
    { name: 'Line' },
    { name: 'Email' },
    { name: 'Telephone' },
    { name: 'Website' },
    { name: 'Facebook', },
    { name: 'Onsite' },
    { name: 'Conference' },
    { name: 'Other' },
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
  depositFiles = []

  myOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy'
  };
  NewUpload: { id: string; name: string; url: string; file: File; }[];

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private siteService: SiteService,
    public fb: FormBuilder,
    private auth: AuthService,
    public userService: UserService,
  ) {
    this.route.params.subscribe(params => this.id = params.id)
  }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user)
    this.upadateTicketForm()
    this.ticketService.getTicketByid(this.id).subscribe(data => {
      this.ticket = data as Ticket
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
        currentStatus: this.ticket.status,
        upload: this.ticket.upload,
        actionSentence: this.ticket.actionSentence,
        dev: this.ticket.dev
      });
      this.getFileUpload()
    })
    this.site$ = this.siteService.getSitesList()
    this.userService.getStaffsList().snapshotChanges().subscribe(data => {
      this.Staff = []
      data.map(items => {
        const item = items.payload.doc.data();
        item['$uid'] = items.payload.doc['id'];
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

  get upload() {
    return this.editTicket.get('upload');
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
      currentStatus: [''],
      upload: [''],
      actionSentence: [''],
      dev: ['']
    });
  }

  upadateForm() {
    this.ticketService.editTicket(this.editTicket.value, this.id);
    this.saveAction()
  }

  getMaPackage() {
    const maStartDate = moment(this.editTicket.controls.site.value.maStartDate).format('DD/MM/YYYY');
    const maEndDate = moment(this.editTicket.controls.site.value.maEndDate).format('DD/MM/YYYY');
    return maStartDate + ' - ' + maEndDate;
  }

  getCurrentUser() {
    return this.user.firstName + ' ' + this.user.lastName
  }


  displaySelectedStatus(): any {
    return (this.status.value) ? this.matchStatus(this.status.value) : 'Save as draft';
  }

  matchStatus(status: string): string {
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
    this.setActionSentence()
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
      this.isAddOns()
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

  isAddOns() {
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

  saveAction() {
    const staffCurrent = this.getCurrentUser()
    this.ticketService
      .setActionById(
        this.id,
        this.editTicket.controls.status.value,
        staffCurrent,
        this.editTicket.controls.assign.value,
        this.editTicket.controls.actionSentence.value)
  }

  isAcceptedAssigned() {
    const currentStatus = this.editTicket.controls.currentStatus.value
    return currentStatus === 'Accepted' || currentStatus === 'Assigned'
  }

  isNotInprogress() {
    return this.editTicket.controls.status.value !== 'In Progress'
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

  getFileUpload() {
    this.depositFiles = this.editTicket.controls.upload.value
    return this.depositFiles
  }

  public onFileRemove(value: any) {
    this.depositFiles = this.editTicket.controls.upload.value.filter((item: { id: any; }) => item.id !== value.id)
    this.editTicket.patchValue({
      upload: this.depositFiles
    });
    this.getFileUpload()
  }

  public mergeFileUpload(upload: any): void {
    if (this.depositFiles !== undefined) {
      this.mergeByProperty(upload, this.depositFiles, 'id');
    }
    this.editTicket.patchValue({
      upload
    });
    this.getFileUpload()
  }

  mergeByProperty(newUpload: any[], depositFiles: any[], prop: string) {
    depositFiles.forEach((sourceElement: { [x: string]: any; }) => {
      const targetElement = newUpload.find((targetElement: { [x: string]: any; }) => {
        return sourceElement[prop] === targetElement[prop];
      })
      targetElement ? Object.assign(targetElement, sourceElement) : newUpload.push(sourceElement);
    })
  }

  deleteCollection() {
    this.ticketService.deleteCollection('upload')
  }

  setActionSentence() {
    let sentence: string
    const userCurrent = this.getCurrentUser()
    const assignDev = this.editTicket.controls.assign.value
    if (this.user.roles.customer === true) {
      if (this.status.value === 'Informed') {
        sentence = `${userCurrent} create ticket`
      } else if (this.status.value === 'Rejected') {
        sentence = `${userCurrent} rejected ticket`
      }
    } else {
      if (this.status.value === 'Draft') {
        sentence = `${userCurrent} create draft`
      } else if (this.status.value === 'Informed') {
        sentence = `${userCurrent} create ticket`
      } else if (this.status.value === 'Rejected') {
        sentence = `${userCurrent} rejected ticket`
      } else if (this.status.value === 'More Info') {
          sentence = `${userCurrent} remark more info`
      } else if (this.status.value === 'Close') {
        sentence = `${userCurrent} close ticket`
      } else if (this.status.value === 'In Progress') {
        sentence = `${userCurrent} set in progress`
      } else if (this.status.value === 'Accepted') {
        sentence = `${userCurrent} accepted ticket`
      } else if (this.status.value === 'Rejected') {
        sentence = `${userCurrent} rejected ticket`
      } else if (this.status.value === 'Pending') {
        sentence = `${userCurrent} set pending`
      } else if (this.status.value === 'Assigned') {
        sentence = `${userCurrent } assigned ticket to ${assignDev}`
      } else if (this.status.value === 'Resolved') {
        sentence = `${userCurrent} resolved task`
      }
    }
    this.editTicket.patchValue({
      actionSentence: sentence
    })
  }
}