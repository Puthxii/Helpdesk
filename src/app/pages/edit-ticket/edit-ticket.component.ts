import { SiteService } from './../../services/site/site.service';
import { Site } from '../../models/site.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Observable } from 'rxjs/internal/Observable';
import { Ticket, Actions, Tasks } from 'src/app/models/ticket.model';
import { TicketService } from 'src/app/services/ticket/ticket.service';
import { IAngularMyDpOptions, IMyDate, IMyDateModel } from 'angular-mydatepicker';
import * as moment from 'moment';
import { Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css']
})
export class EditTicketComponent implements OnInit {
  site$: Observable<any>;
  devSettings: IDropdownSettings;
  dropdownSettings: IDropdownSettings;
  id: string;
  ticket$: Observable<Ticket>;
  public editTicket: FormGroup;
  moduleList: any[];
  Site: Site[];
  user: User
  Staff: User[];
  Task: Tasks[];
  progress: any;
  staff: any;
  sumPoint: any;
  total: any;
  statusCurrent: any;
  currentName: string
  user$: any
  addTask = false;
  updateTask = false;
  taskIdx: number;
  showTask = false
  Stafficon = [
    { icon: 'fas fa-user' },
  ];
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
    { name: 'Save as Reject', value: 'Rejected' },
  ];
  ticket: any;
  depositDescriptionFiles = []
  depositResponseDescriptionFiles = []
  depositMaDescriptionFiles = []
  depositSuggestDescriptionFiles = []
  depositResolveDescriptionFiles = []
  forDescription = 'forDescription'
  forResponseDescription = 'forResponseDescription'
  forMaDescription = 'forMaDescription'
  forSuggestDescription = 'forSuggestDescription'
  forResolveDescription = 'forResolveDescription'
  stateParticipant = []
  depositTasks = []
  entryTask = []
  newTask: any
  subjectTasks: any;
  assignTask: any;
  deadlineDate: any;
  myOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    disableUntil: this.minDate(),
  };
  NewUpload: { id: string; name: string; url: string; file: File; }[];
  tasks: Observable<any>
  isEdit = false
  isEditSuggest = false
  isEditResolve = false
  title: string
  Tasks: Tasks[];
  Actions: Actions
  tasksToSave: Tasks[] = [];
  tasksToUpdate: Tasks[] = [];
  tasksToDelete: Tasks[] = [];
  maxDueDate: any;
  minDueDate: any;

  constructor(
    public ticketService: TicketService,
    public route: ActivatedRoute,
    public siteService: SiteService,
    public fb: FormBuilder,
    public auth: AuthService,
    public userService: UserService,
    public router: Router,
  ) {
    this.route.params.subscribe(params => this.id = params.id)
  }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.user = user;
      this.getTitleByRoles()
    })
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
        responseDescription: this.ticket.responseDescription,
        responseDescriptionFile: this.ticket.responseDescriptionFile,
        status: this.ticket.status,
        staff: this.ticket.staff,
        siteName: this.ticket.site.nameEN,
        assign: this.ticket.assign,
        currentStatus: this.ticket.status,
        descriptionFile: this.ticket.descriptionFile,
        actionSentence: this.ticket.actionSentence,
        dev: this.ticket.dev,
        subjectTask: this.ticket.subjectTask,
        assignTask: this.ticket.assignTask,
        deadlineDate: this.ticket.deadlineDate,
        participant: this.ticket.participant,
        addTasks: this.ticket.addTasks,
        maDescription: this.ticket.maDescription,
        maDescriptionFile: this.ticket.maDescriptionFile,
        suggestDescription: this.ticket.suggestDescription,
        suggestDescriptionFile: this.ticket.suggestDescriptionFile,
        resolveDescription: this.ticket.resolveDescription,
        resolveDescriptionFile: this.ticket.resolveDescriptionFile
      });
      this.getDescriptionFileUpload()
      this.getResponseDescriptionFileUpload()
      this.getMaDescriptionFileUpload()
      this.getSuggestDescriptionFileUpload()
      this.getResolvedDescriptionFileUpload()
      this.getParticipant()
      this.setDefaultMaDescription()
      this.setDefaultMaDescriptionFile()
      this.setDefaultSuggestDescription()
      this.setDefaultSuggestDescriptionFile()
      this.setDefaultResolveDescription()
      this.setDefaultResolveDescriptionFile()
      this.getModule();
    })
    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      noDataAvailablePlaceholderText: 'Please choose site or site does not have module',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: false
    };
    this.devSettings = {
      singleSelection: false,
      idField: '$uid',
      textField: 'fullName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      noDataAvailablePlaceholderText: 'No developer',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      enableCheckAll: false
    };
    this.site$ = this.siteService.getSitesList()
    this.getDeveloper()
    this.getTask()
  }

  minDate(): IMyDate {
    const date = new Date()
    const day = date.getDate() - 1
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return { year, month, day }
  }

  getTask() {
    this.ticketService.getTask(this.id).snapshotChanges().subscribe(data => {
      this.Tasks = []
      data.map(items => {
        const item = items.payload.doc.data();
        item['id'] = items.payload.doc['id'];
        this.Tasks.push(item as Tasks)
        this.depositTasks = this.Tasks
      })
      this.totalPoint()
      this.checkDueDate()
      this.progressbar()
    })
  }

  getDeveloper() {
    this.userService.getDeveloper().snapshotChanges().subscribe(data => {
      this.Staff = []
      data.map(items => {
        const item = items.payload.doc.data();
        item['$uid'] = items.payload.doc['id'];
        this.Staff.push(item as User)
      })
    });
  }

  getModule() {
    if (this.editTicket.controls.site.value.module) {
      this.moduleList = this.editTicket.controls.site.value.module;
      this.moduleList.sort((a, b) => a.localeCompare(b));
    } else {
      this.moduleList = [];
    }
    return this.moduleList;
  }

  setDefaultMaDescription() {
    const endDate = new Date(this.editTicket.controls.site.value.maEndDate.seconds * 1000)
    const currentDate = new Date()
    let maDescription: string
    if (this.editTicket.controls.maDescription.value === undefined) {
      if (endDate > currentDate) {
        maDescription = 'อยู่ในระยะเวลา Maintenance Package'
      } else {
        maDescription = 'ไม่อยู่ในระยะเวลา Maintenance Package'
      }
    } else {
      maDescription = this.editTicket.controls.maDescription.value
    }
    this.editTicket.patchValue({
      maDescription
    });
  }

  setDefaultMaDescriptionFile() {
    let maDescriptionFile: any
    if (this.editTicket.controls.maDescriptionFile.value === undefined) {
      maDescriptionFile = []
    } else {
      maDescriptionFile = this.editTicket.controls.maDescriptionFile.value
    }
    this.editTicket.patchValue({
      maDescriptionFile
    });
  }

  setDefaultSuggestDescription() {
    let suggestDescription: string
    if (this.editTicket.controls.suggestDescription.value === undefined) {
      suggestDescription = ''
    } else {
      suggestDescription = this.editTicket.controls.suggestDescription.value
    }
    this.editTicket.patchValue({
      suggestDescription
    });
  }

  setDefaultSuggestDescriptionFile() {
    let suggestDescriptionFile: any
    if (this.editTicket.controls.suggestDescriptionFile.value === undefined) {
      suggestDescriptionFile = []
    } else {
      suggestDescriptionFile = this.editTicket.controls.suggestDescriptionFile.value
    }
    this.editTicket.patchValue({
      suggestDescriptionFile
    });
  }

  setDefaultResolveDescription() {
    let resolveDescription: string
    if (this.editTicket.controls.resolveDescription.value === undefined) {
      resolveDescription = ''
    } else {
      resolveDescription = this.editTicket.controls.resolveDescription.value
    }
    this.editTicket.patchValue({
      resolveDescription
    });
  }

  setDefaultResolveDescriptionFile() {
    let resolveDescriptionFile: any
    if (this.editTicket.controls.resolveDescriptionFile.value === undefined) {
      resolveDescriptionFile = []
    } else {
      resolveDescriptionFile = this.editTicket.controls.resolveDescriptionFile.value
    }
    this.editTicket.patchValue({
      resolveDescriptionFile
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

  get responseDescription() {
    return this.editTicket.get('responseDescription');
  }

  get status() {
    return this.editTicket.get('status');
  }

  get assign() {
    return this.editTicket.get('assign');
  }

  get upldescriptionFileoad() {
    return this.editTicket.get('descriptionFile');
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
      responseDescription: [''],
      responseDescriptionFile: [''],
      status: [''],
      staff: [''],
      product: [''],
      siteName: [''],
      maintenancePackage: [''],
      assign: [''],
      currentStatus: [''],
      descriptionFile: [''],
      actionSentence: [''],
      dev: [''],
      tasks: this.fb.group({
        id: [''],
        subjectTask: ['', [Validators.required]],
        developer: ['', [Validators.required]],
        point: ['', [Validators.required]],
        dueDate: ['', [Validators.required]],
        checked: ['']
      }),
      participant: [''],
      addTasks: [''],
      maDescription: [''],
      maDescriptionFile: [''],
      suggestDescription: [''],
      suggestDescriptionFile: [''],
      resolveDescription: [''],
      resolveDescriptionFile: [''],
      sumPoint: [''],
      maxDueDate: [''],
      minDueDate: ['']
    });
  }

  updateForm() {
    this.checkAction()
    this.ticketService.editTicket(this.editTicket.value, this.id, this.user.roles);
  }

  getMaPackage() {
    const startDate = moment(this.editTicket.controls.site.value.maStartDate.seconds * 1000).format('L');
    const endDate = moment(this.editTicket.controls.site.value.maEndDate.seconds * 1000).format('L');
    return startDate + ' - ' + endDate;
  }

  getCurrentUser() {
    return this.user.fullName
  }

  getCurrentStaff() {
    if (this.user.roles.customer != true) {
      return this.user.fullName
    }
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
      this.removeStatus('More Info');
      this.removeStatus('Accepted');
      this.removeStatus('Assigned');
      this.removeStatus('Resolved');
      this.removeStatus('Closed');
      this.removeStatus('Rejected');
      this.isCloseInProgress()
    } else if (currentStatus === 'Informed') {
      this.removeStatus('More Info');
      this.removeStatus('Rejected');
      this.removeStatus('Accepted');
      this.removeStatus('Assigned');
      this.removeStatus('Resolved');
      this.removeStatus('Draft');
      this.removeStatus('Assigned');
      this.isCloseInProgress()
    } else if (currentStatus === 'More Info') {
      this.addStatus('More Info');
      this.addStatus('Informed');
      this.isCloseInProgress()
      this.removeStatus('Draft');
      this.removeStatus('Accepted');
      this.removeStatus('Assigned');
      this.removeStatus('Resolved');
      this.removeStatus('Rejected');
    } else if (currentStatus === 'In Progress') {
      this.removeStatus('Accepted');
      this.removeStatus('Rejected');
      this.isAddOns()
      this.isEditMaDescription(Event);
      this.removeStatus('Draft');
      this.removeStatus('Informed');
      this.removeStatus('More Info');
      this.removeStatus('Assigned');
      this.removeStatus('Resolved');
    } else if (currentStatus === 'Accepted') {
      if (this.user.roles.supervisor === true && this.depositTasks.length != 0 && this.isEditSuggest) {
        this.addStatus('Assigned');
      } else {
        this.removeStatus('Assigned');
      }
      this.removeStatus('Rejected');
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
      this.removeStatus('Resolved');
      this.removeStatus('Rejected');
      this.isResolveDescription(Event)
    } else if (currentStatus === 'Resolved') {
      this.removeStatus('Draft');
      this.removeStatus('Informed');
      this.removeStatus('More Info');
      this.removeStatus('In Progress');
      this.removeStatus('Accepted');
      this.removeStatus('Assigned');
      if (this.user.roles.supporter) {
        this.addStatus('Closed');
      } else {
        this.removeStatus('Closed');
      }
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
    if (this.editTicket.controls.type.value === 'Info' ||
      this.editTicket.controls.type.value === 'Consult' ||
      this.editTicket.controls.type.value === 'Undefined') {
      this.removeStatus('In Progress');
      this.isResponseDescription(Event)
    } else if (this.editTicket.controls.type.value === 'Problem' || this.editTicket.controls.type.value === 'Add-ons') {
      this.removeStatus('Closed');
      this.addStatus('In Progress');
    }
  }

  isAssignDev() {
    this.addStatus('Assigned');
    (this.depositTasks.length != 0 && this.isEditSuggest) ? this.onSelectedStatus('Assigned') : this.onSelectedStatus('Accepted')
  }

  checkAction() {
    const staff = this.getCurrentStaff()
    const currentStatus = this.editTicket.controls.currentStatus.value
    const status = this.editTicket.controls.status.value
    const dev = ''
    const actionSentence = this.editTicket.controls.actionSentence.value;
    (currentStatus != status && this.isSupAcceptedAssigned(status)) ? this.saveAction(actionSentence, dev, staff, status) : ''
  }

  isSupAcceptedAssigned(status: any) {
    if (this.user.roles.supervisor === true && (status === 'Assigned' || status === 'Accepted')) {
      return false
    } else {
      return true
    }
  }

  saveAction(actionSentence: any, dev: any, staff: any, status: any) {
    if (typeof staff === 'undefined') {
      staff = ''
    }
    this.Actions = {
      actionSentence,
      dev,
      staff,
      status
    }
    this.setActionById(this.Actions)
  }

  setActionById(Actions: Actions) {
    this.ticketService.setActionById(
      this.id,
      Actions
    )
  }

  isAcceptedAssigned() {
    const currentStatus = this.editTicket.controls.currentStatus.value
    return currentStatus === 'Accepted' || currentStatus === 'Assigned' || currentStatus === 'Resolved'
  }

  isNotInprogress() {
    return this.editTicket.controls.status.value !== 'In Progress'
  }

  isSelectedType() {
    return (this.editTicket.controls.type.value === 'Info' || this.editTicket.controls.type.value === 'Consult')
  }

  isEditDescription(event: any) {
    this.isEdit = true
  }

  isResponseDescription(event: any) {
    (this.editTicket.controls.responseDescription.value) ?
      (this.addStatus('Closed'), this.addStatus('More Info'), this.addStatus('Rejected'))
      : (this.removeStatus('Closed'), this.removeStatus('More Info'), this.removeStatus('Rejected'))
  }

  isEditMaDescription(event: any) {
    (this.editTicket.controls.maDescription.value) ?
      (this.addStatus('Accepted'), this.addStatus('Rejected'))
      : (this.removeStatus('Accepted'), this.removeStatus('Rejected'))
  }

  isEditSuggestDescription(event: any) {
    (this.editTicket.controls.suggestDescription.value) ? this.isEditSuggest = true : this.isEditSuggest = false;
    this.isAssignDev()
  }

  isResolveDescription(event: any) {
    (this.editTicket.controls.resolveDescription.value) ? (this.addStatus('Resolved'), this.isEditResolve = true, this.changeChecked())
      : (this.removeStatus('Resolved'), this.isEditResolve = false, this.onSelectedStatus('Assigned'))
  }

  removeStatus(status: string) {
    this.Status = this.Status.filter(item => item.value !== status)
  }

  addStatus(status: string) {
    if (this.Status.some(item => item.value === status)) {
      console.log('Object found inside the array');
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

  getDescriptionFileUpload() {
    this.depositDescriptionFiles = this.editTicket.controls.descriptionFile.value
    return this.depositDescriptionFiles
  }

  getResponseDescriptionFileUpload() {
    this.depositResponseDescriptionFiles = this.editTicket.controls.responseDescriptionFile.value
    return this.depositResponseDescriptionFiles
  }

  getMaDescriptionFileUpload() {
    this.depositMaDescriptionFiles = this.editTicket.controls.maDescriptionFile.value
    return this.depositMaDescriptionFiles
  }

  getSuggestDescriptionFileUpload() {
    this.depositSuggestDescriptionFiles = this.editTicket.controls.suggestDescriptionFile.value
    return this.depositSuggestDescriptionFiles
  }

  getResolvedDescriptionFileUpload() {
    this.depositResolveDescriptionFiles = this.editTicket.controls.resolveDescriptionFile.value
    return this.depositResolveDescriptionFiles
  }

  getParticipant() {
    this.stateParticipant = this.editTicket.controls.participant.value
  }

  public onDepositDescriptionFileRemove(value: any) {
    this.depositDescriptionFiles = this.editTicket.controls.descriptionFile.value.filter((item: { id: any; }) => item.id !== value.id)
    this.editTicket.patchValue({
      descriptionFile: this.depositDescriptionFiles
    });
    this.getDescriptionFileUpload()
  }

  public onDepositResponDescriptionFileRemove(value: any) {
    this.depositResponseDescriptionFiles = this.editTicket.controls.responseDescriptionFile.value
      .filter((item: { id: any; }) => item.id !== value.id)
    this.editTicket.patchValue({
      responseDescriptionFile: this.depositResponseDescriptionFiles
    });
    this.getResponseDescriptionFileUpload()
  }

  public onDepositMaDescriptionFileRemove(value: any) {
    this.depositMaDescriptionFiles = this.editTicket.controls.maDescriptionFile.value
      .filter((item: { id: any; }) => item.id !== value.id)
    this.editTicket.patchValue({
      maDescriptionFile: this.depositMaDescriptionFiles
    });
    this.getMaDescriptionFileUpload()
  }

  public onDepositSuggestDescriptionFileRemove(value: any) {
    this.depositSuggestDescriptionFiles = this.editTicket.controls.suggestDescriptionFile.value
      .filter((item: { id: any; }) => item.id !== value.id)
    this.editTicket.patchValue({
      suggestDescriptionFile: this.depositSuggestDescriptionFiles
    });
    this.getSuggestDescriptionFileUpload()
  }

  public onDepositResolveDescriptionFileRemove(value: any) {
    this.depositResolveDescriptionFiles = this.editTicket.controls.resolveDescriptionFile.value
      .filter((item: { id: any; }) => item.id !== value.id)
    this.editTicket.patchValue({
      resolveDescriptionFile: this.depositResolveDescriptionFiles
    });
    this.getResolvedDescriptionFileUpload()
  }

  public mergeDescriptionFileUpload(upload: any): void {
    if (this.depositDescriptionFiles !== undefined) {
      this.mergeByProperty(upload, this.depositDescriptionFiles, 'id');
    }
    this.editTicket.patchValue({
      descriptionFile: upload
    });
    this.getDescriptionFileUpload()
  }

  public mergeResponseDescriptionFileUpload(upload: any): void {
    if (this.depositResponseDescriptionFiles !== undefined) {
      this.mergeByProperty(upload, this.depositResponseDescriptionFiles, 'id');
    }
    this.editTicket.patchValue({
      responseDescriptionFile: upload
    });
    this.getResponseDescriptionFileUpload()
  }

  public mergeMaDescriptionFileUpload(upload: any): void {
    if (this.depositMaDescriptionFiles !== undefined) {
      this.mergeByProperty(upload, this.depositMaDescriptionFiles, 'id');
    }
    this.editTicket.patchValue({
      maDescriptionFile: upload
    });
    this.getMaDescriptionFileUpload()
  }

  public mergeSuggestDescriptionFileUpload(upload: any): void {
    if (this.depositSuggestDescriptionFiles !== undefined) {
      this.mergeByProperty(upload, this.depositSuggestDescriptionFiles, 'id');
    }
    this.editTicket.patchValue({
      suggestDescriptionFile: upload
    });
    this.getSuggestDescriptionFileUpload()
  }

  public mergeResolveDescriptionFileUpload(upload: any): void {
    if (this.depositResolveDescriptionFiles !== undefined) {
      this.mergeByProperty(upload, this.depositResolveDescriptionFiles, 'id');
    }
    this.editTicket.patchValue({
      resolveDescriptionFile: upload
    });
    this.getResolvedDescriptionFileUpload()
  }

  mergeByProperty(newUpload: any[], depositFiles: any[], prop: string) {
    depositFiles.forEach((sourceElement: { [x: string]: any; }) => {
      const targetElement = newUpload.find((targetElement: { [x: string]: any; }) => {
        return sourceElement[prop] === targetElement[prop];
      })
      targetElement ? Object.assign(targetElement, sourceElement) : newUpload.push(sourceElement);
    })
  }

  deleteCollection(collection: string) {
    this.ticketService.deleteCollection(collection)
  }

  setActionSentence() {
    let sentence: string
    const userCurrent = this.getCurrentUser()
    if (this.user.roles.customer === true) {
      if (this.status.value === 'Informed') {
        sentence = `${userCurrent} edit ticket`
      } else if (this.status.value === 'Rejected') {
        sentence = `${userCurrent} rejected ticket`
      } else if (this.status.value === 'More Info') {
        sentence = `${userCurrent} edit ticket`
        if (this.isEdit) {
          this.onSelectedStatus('Informed')
        }
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
      } else if (this.status.value === 'Closed') {
        sentence = `${userCurrent} closed ticket`
      } else if (this.status.value === 'In Progress') {
        sentence = `${userCurrent} set in progress`
      } else if (this.status.value === 'Accepted') {
        sentence = `${userCurrent} accepted ticket`
      } else if (this.status.value === 'Rejected') {
        sentence = `${userCurrent} rejected ticket`
      } else if (this.status.value === 'Pending') {
        sentence = `${userCurrent} set pending`
      } else if (this.status.value === 'Resolved') {
        sentence = `${userCurrent} resolved task`
      }
      this.setParticaipant(userCurrent)
    }
    this.editTicket.patchValue({
      actionSentence: sentence
    })
  }

  setParticaipant(currentParticipant: any) {
    this.mergeParticipant(currentParticipant)
    this.editTicket.patchValue({
      participant: this.stateParticipant
    });
  }

  mergeParticipant(name: any) {
    if (this.stateParticipant.indexOf(name) !== -1) {
      console.log('Value found inside the array')
    } else {
      this.stateParticipant.push(name)
    }
  }

  setTask(): void {
    this.clearTask()
    this.addTask = true;
    this.updateTask = false;
    this.taskIdx = null;
    this.showTask = !this.showTask;
  }

  onCancelAddTaks() {
    this.addTask = false;
  }

  onTasksSubmit() {
    const subjectTask = this.editTicket.controls.tasks.value.subjectTask
    const developer = this.editTicket.controls.tasks.value.developer
    const point = this.editTicket.controls.tasks.value.point
    const dueDate = this.editTicket.controls.tasks.value.dueDate
    const checked = false
    this.newTask = {
      subjectTask, developer, point, dueDate, checked
    }
    this.depositTasks.push(this.newTask);
    this.isTasksExit(this.depositTasks)
    this.clearTask()
    this.addTask = false;
    this.totalPoint()
    this.checkDueDate()
    this.isAssignDev()
    this.saveTasks()
    this.progressbar()
  }

  isTasksExit(depositTasks: any[]) {
    this.tasksToSave = []
    depositTasks.forEach(task => {
      if (typeof task.id === 'undefined') {
        return this.tasksToSave.push(task)
      }
    })
  }

  clearTask() {
    this.editTicket.patchValue({
      tasks: {
        subjectTask: '',
        developer: '',
        point: '',
        dueDate: ''
      }
    })
  }

  removeTasks(i: number): any {
    if (typeof this.depositTasks[i].id === 'undefined') {
      this.depositTasks.splice(i, 1);
      this.isTasksExit(this.depositTasks)
    } else {
      this.tasksToDelete.push(this.depositTasks[i])
      this.depositTasks.splice(i, 1);
    }
    this.deleteTasks()
    this.totalPoint()
    this.isAssignDev()
    this.checkDueDate()
  }

  onCancelUpdateTaks() {
    this.updateTask = false;
    this.taskIdx = null;
    this.showTask = !this.showTask;
    this.clearTask()
  }

  formUpdateTasks(task: Tasks, i: number) {
    this.addTask = false
    this.updateTask = true;
    this.taskIdx = i;
    this.showTask = !this.showTask;
    this.editTicket.patchValue({
      tasks: {
        id: task.id,
        subjectTask: task.subjectTask,
        developer: task.developer,
        point: task.point,
        dueDate: task.dueDate,
        checked: task.checked
      }
    })
  }

  onUpdateTask(i: number) {
    const updateTask = this.editTicket.controls.tasks.value
    if (typeof updateTask.id === 'undefined') {
      this.depositTasks[i] = updateTask
      this.depositTasks.push();
      this.isTasksExit(this.depositTasks)
    } else {
      this.depositTasks[i] = updateTask
      this.tasksToUpdate.push(updateTask)
    }
    this.updateTask = false;
    this.taskIdx = null;
    this.showTask = !this.showTask;
    this.updateTasks()
    this.totalPoint()
    this.clearTask()
    this.isAssignDev()
    this.checkDueDate()
  }


  saveTasks() {
    const staff = this.getCurrentStaff()
    const status = this.editTicket.controls.status.value
    if (this.tasksToSave.length != 0) {
      for (let i = 0; this.tasksToSave.length > i; i++) {
        this.ticketService.setAddTasks(
          this.id,
          this.tasksToSave[i]
        )
        for (let j = 0; this.tasksToSave[i].developer.length > j; j++) {
          this.setParticaipant(this.tasksToSave[i].developer[j].fullName)
        }
        this.saveAction(`${staff} assigned task to developer`, this.tasksToSave[i].developer, staff, status)
      }
    }
  }

  updateTasks() {
    const staff = this.getCurrentStaff()
    const status = this.editTicket.controls.status.value
    if (this.tasksToUpdate.length != 0) {
      for (let i = 0; this.tasksToUpdate.length > i; i++) {
        this.ticketService.updateTasks(
          this.id,
          this.tasksToUpdate[i]
        )
        this.saveAction(`${staff} edit task`, this.tasksToUpdate[i].developer, staff, status)
      }
    }
  }

  deleteTasks() {
    const staff = this.getCurrentStaff()
    const status = this.editTicket.controls.status.value
    if (this.tasksToDelete.length != 0) {
      for (let i = 0; this.tasksToDelete.length > i; i++) {
        this.ticketService.removeTasks(
          this.id,
          this.tasksToDelete[i]
        )
        this.saveAction(`${staff} delete task`, this.tasksToDelete[i].developer, staff, status)
      }
    }
  }

  getTitleByRoles() {
    if (this.user.roles === undefined) {
    } else {
      if (this.user.roles.customer === true) {
        this.title = `Customer's Edit Ticket`
      } else if (this.user.roles.supporter === true) {
        this.title = `Supporter's Edit Ticket`
      } else if (this.user.roles.maintenance === true) {
        this.title = `Maintenance's Edit Ticket`
      } else if (this.user.roles.supervisor === true) {
        this.title = `Supervisor's Edit Ticket`
      } else if (this.user.roles.developer === true) {
        this.title = `Developer's Edit Ticket`
      }
    }
    return this.title
  }

  alertCancelTicket() {
    Swal.fire({
      title: 'Do you want to cancel edit ticket.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2ED0B9',
      cancelButtonColor: '#9C9FA6',
      confirmButtonText: 'Yes, I do'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        if (this.user.roles.customer === true) {
          this.deleteCollection('uploadDesciption')
          this.router.navigate(['/site-ticket']);
        } else if (this.user.roles.supporter === true) {
          this.deleteCollection('uploadDesciption')
          this.deleteCollection('uploadResponseDescription')
          this.router.navigate(['/ticket']);
        } else if (this.user.roles.maintenance === true) {
          this.deleteCollection('uploadMaDescription')
          this.router.navigate(['/ticket-ma']);
        } else if (this.user.roles.supervisor === true) {
          this.deleteCollection('uploadSuggestDescription')
          this.router.navigate(['/ticket-sup']);
        } else if (this.user.roles.developer === true) {
          this.deleteCollection('uploadResolveDescription')
          this.router.navigate(['/ticket-dev']);
        }
      }
    })
  }

  isAssignedResolved() {
    return this.editTicket.controls.currentStatus.value === 'Assigned' || this.editTicket.controls.currentStatus.value === 'Resolved'
  }

  setExpirationDate() {
    let color = ''
    const endDate = new Date(this.editTicket.controls.site.value.maEndDate.seconds * 1000)
    const currentDate = new Date()
    if (endDate > currentDate) {
      color = 'curentDate'
    } else {
      color = 'expirationDate'
    }
    return color
  }

  totalPoint() {
    this.sumPoint = 0
    if (this.depositTasks.length !== undefined) {
      for (let i = 0; this.depositTasks.length > i; i++) {
        this.sumPoint = this.sumPoint + this.depositTasks[i].point
      }
    }
    this.setSumPoint(this.sumPoint)
  }

  setSumPoint(sumPoint: any) {
    this.editTicket.patchValue({
      sumPoint
    });
  }


  getDev(task: { developer: string | any[]; }) {
    const name = []
    for (let i = 0; task.developer.length > i; i++) {
      name.push(task.developer[i].fullName)
    }
    return (name.length !== 0) ? name : '-'
  }

  checkDueDate() {
    if (this.depositTasks.length !== 0) {
      this.maxDueDate = this.depositTasks.sort((a, b) =>
        new Date(b.dueDate.singleDate.jsDate.seconds * 1000).getTime() - new Date(a.dueDate.singleDate.jsDate.seconds * 1000).getTime())[0]
        .dueDate.singleDate.jsDate;
      this.minDueDate = this.depositTasks.sort((b, a) =>
        new Date(b.dueDate.singleDate.jsDate.seconds * 1000).getTime() - new Date(a.dueDate.singleDate.jsDate.seconds * 1000).getTime())[0]
        .dueDate.singleDate.jsDate;
      this.setMaxDueDate(this.maxDueDate)
      this.setMinDueDate(this.minDueDate)
    } else {
      this.maxDueDate = null
      this.minDueDate = null
      this.setMaxDueDate(this.maxDueDate)
      this.setMinDueDate(this.minDueDate)
    }
  }

  setMaxDueDate(maxDueDate: any) {
    this.editTicket.patchValue({
      maxDueDate
    })
  }

  setMinDueDate(minDueDate: any) {
    this.editTicket.patchValue({
      minDueDate
    })
  }

  changeChecked(): void {
    const isChecked = (this.depositTasks.findIndex(task => task.checked === false) === -1)
    if (this.depositTasks.length !== 0) {
      for (let i = 0; this.depositTasks.length > i; i++) {
        if (this.depositTasks[i].id) {
          if (isChecked === true && this.isEditResolve === true) {
            this.ticketService.updateTasks(
              this.id,
              this.depositTasks[i]
            )
          } else {
            this.ticketService.updateTasks(
              this.id,
              this.depositTasks[i]
            )
          }
        } else {
          if (isChecked === true) {
            this.ticketService.setAddTasks(
              this.id,
              this.depositTasks[i]
            )
          } else {
            this.ticketService.setAddTasks(
              this.id,
              this.depositTasks[i]
            )
          }
        }
      }
    }
    this.progressbar()
  }

  progressbar() {
    if (this.depositTasks.length !== 0) {
      let total = 0
      let poinOfCheck = 0
      for (let i = 0; this.depositTasks.length > i; i++) {
        total = total + this.depositTasks[i].point
        if (this.depositTasks[i].checked === true) {
          poinOfCheck = poinOfCheck + this.depositTasks[i].point
        }
      }
      return this.progress = ((poinOfCheck / total) * 100).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    }
    return this.progress = 0
  }

  myTask(task: Tasks) {
    return task.developer.map(dev => dev.$uid).includes(this.user.uid);
  }

}
