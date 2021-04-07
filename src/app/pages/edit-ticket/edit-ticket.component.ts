import { SiteService } from './../../services/site/site.service';
import { Site } from '../../models/site.model';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Observable } from 'rxjs/internal/Observable';
import { Tasks, Ticket } from 'src/app/models/ticket.model';
import { TicketService } from 'src/app/services/ticket/ticket.service';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
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
  dropdownSettings: IDropdownSettings;
  id: string;
  ticket$: Observable<Ticket>;
  public editTicket: FormGroup;
  moduleList: any[];
  Site: Site[];
  user: User
  Staff: User[];
  Task: Tasks[];
  staff: any;
  statusCurrent: any;
  currentName: string
  user$: any
  show = false;
  buttonName = 'Show';
  hide: any;
  saveTask = false;
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
    dateFormat: 'dd/mm/yyyy'
  };
  NewUpload: { id: string; name: string; url: string; file: File; }[];
  tasks: Observable<any>
  isEdit = false
  title: string

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private siteService: SiteService,
    public fb: FormBuilder,
    private auth: AuthService,
    public userService: UserService,
    private router: Router,
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
    this.site$ = this.siteService.getSitesList()
    this.getDeveloper()
    this.getTask()
  }


  getTask() {
    this.ticketService.getTask(this.id).snapshotChanges().subscribe(task => {
      this.depositTasks = []
      task.map(items => {
          const item = items.payload.doc.data()
          item.$uid = items.payload.doc.id;
          this.depositTasks.push(item as Tasks)
      })
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
    const endDate = moment(this.editTicket.controls.site.value.maEndDate.seconds * 1000).format('L');
    const newDate = new Date()
    const newDateFormat = moment(newDate).format('L');
    let maDescription: string
    if (this.editTicket.controls.maDescription.value === undefined) {
      if (endDate < newDateFormat) {
        maDescription = 'หมดอายุการบำรุงรักษา ไม่ตรงตามเงื่อนไขสัญญา'
      } else {
        maDescription = 'ตรงตามเงื่อนไขสัญญา'
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
      tasks: this.fb.array([
        this.fb.control(null)
      ]),
      subjectTask: [],
      assignTask: [],
      deadlineDate: [],
      participant: [''],
      addTasks: [''],
      maDescription: [''],
      maDescriptionFile: [''],
      suggestDescription: [''],
      suggestDescriptionFile: [''],
      resolveDescription: [''],
      resolveDescriptionFile: ['']
    });
  }

  upadateForm() {
    this.saveTasks()
    this.ticketService.editTicket(this.editTicket.value, this.id, this.user.roles);
    this.checkAction()
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
      this.removeStatus('Close');
      this.isCloseInProgress()
    } else if (currentStatus === 'Informed') {
      this.removeStatus('More Info');
      this.addStatus('Rejected');
      this.removeStatus('Accepted');
      this.removeStatus('Assigned');
      this.removeStatus('Resolved');
      this.removeStatus('Draft');
      this.removeStatus('Assigned');
      this.isCloseInProgress()
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
      // this.removeStatus('Assigned');
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
    (this.editTicket.controls.assign.value) ? this.onSelectedStatus('Assigned') : this.onSelectedStatus('Accepted')
  }

  checkAction() {
    const staffCurrent = this.getCurrentStaff()
    const currentStatus = this.editTicket.controls.currentStatus.value
    const newStatus = this.editTicket.controls.status.value
    if (currentStatus === newStatus) {
    } else {
      this.saveAction(staffCurrent, newStatus)
    }
  }

  saveAction(staffCurrent: string, newStatus: any) {
    this.ticketService
      .setActionById(
        this.id,
        newStatus,
        staffCurrent ? staffCurrent : '',
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

  isResponseDescription(event: any) {
    (this.editTicket.controls.responseDescription.value) ?
      (this.addStatus('Closed'), this.addStatus('More Info'))
      : (this.removeStatus('Closed'), this.removeStatus('More Info'))
  }

  isEditDescription(event: any) {
    this.isEdit = true
  }

  isResolveDescription(event: any) {
    (this.editTicket.controls.resolveDescription.value) ? this.addStatus('Resolved') : this.removeStatus('Resolved')
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
    const assignDev = this.editTicket.controls.assign.value
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
        sentence = `${userCurrent}  remark more info`
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
      } else if (this.status.value === 'Assigned') {
        sentence = `${userCurrent} assigned ticket to ${assignDev}`
        this.setParticaipant(assignDev)
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

  onTasksSubmit() {
    const subjectTask = this.editTicket.controls.subjectTask.value
    const assignTask = this.editTicket.controls.assignTask.value
    const deadlineDate = this.editTicket.controls.deadlineDate.value
    this.newTask = {
      subjectTask, assignTask, deadlineDate
    }
    this.depositTasks.push(this.newTask)
    this.clearTask()
  }

  clearTask() {
    this.editTicket.patchValue({
      subjectTask: '',
      assignTask: '',
      deadlineDate: ''
    })
  }

  removeTask(i: number): void {
    this.depositTasks.splice(i, 1);
  }

  saveTasks() {
    if (this.depositTasks.length !== 0) {
      for (let i = 0; this.depositTasks.length > i; i++) {
        if (this.depositTasks[i].$uid === undefined) {
          this.ticketService.setAddTasks(
            this.id,
            this.depositTasks[i]
          )
        }
      }
    }
  }


// todo
// oldData
// newData
//  if find oldData == have oldData
// -> save newData and merge oldData

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
    const endDate = moment(this.editTicket.controls.site.value.maStartDate * 1000).format('L');
    const currentDate = new Date()
    const currentDateFormat = moment(currentDate).format('L');
    if (endDate > currentDateFormat) {
      color = 'curentDate'
    } else {
      color = 'expirationDate'
    }
    return color
  }

  showHide() {
    this.show = !this.show
    if (this.show) {
      this.buttonName = 'Show'
    } else {
      this.buttonName = 'Hide'
    }
  }

}
