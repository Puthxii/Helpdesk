import { UserService } from 'src/app/services/user/user.service';
import { Product } from '../../models/product.model';
import { ProductService } from './../../services/product/product.service';
import { SiteService } from './../../services/site/site.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TicketService } from 'src/app/services/ticket/ticket.service';
import * as moment from 'moment';
import { Site } from 'src/app/models/site.model';
import { Observable } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/models/user.model';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.scss'],
})
export class AddTicketComponent implements OnInit {
  constructor(
    private auth: AuthService,
    public ticketService: TicketService,
    public siteService: SiteService,
    public productService: ProductService,
    public fb: FormBuilder,
    public userService: UserService,
    private router: Router,
  ) {
  }

  get date() {
    return this.addTicketForm.get('date');
  }

  get source() {
    return this.addTicketForm.get('source');
  }

  get site() {
    return this.addTicketForm.get('site');
  }

  get maintenancePackage() {
    return this.addTicketForm.get('maintenancePackage');
  }

  get module() {
    return this.addTicketForm.get('module');
  }

  get creator() {
    return this.addTicketForm.get('creator');
  }

  get type() {
    return this.addTicketForm.get('type');
  }

  get subject() {
    return this.addTicketForm.get('subject');
  }

  get priority() {
    return this.addTicketForm.get('priority');
  }

  get description() {
    return this.addTicketForm.get('description');
  }

  get responseDescription() {
    return this.addTicketForm.get('responseDescription');
  }

  get status() {
    return this.addTicketForm.get('status');
  }
  users: any;
  user: User;
  Product: Product;
  site$: Observable<any>;
  user$: any;
  public addTicketForm: FormGroup;
  hideResponse = false;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings;
  maxDate = moment(new Date()).format('YYYY-MM-DD');
  minDate = moment().subtract(1, 'months').format('YYYY-MM-DD');
  User: User;
  Site: Site[];
  moduleList: any[];
  devList: any[];
  currentName: string
  Sources = [
    { name: 'Line' },
    { name: 'Email' },
    { name: 'Telephone' },
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
    { name: 'Save as Inform', value: 'Informed' },
    { name: 'Save as Draft', value: 'Draft' },
    { name: 'Save as Reject', value: 'Rejected' },
  ];
  forDescription = 'forDescription'
  forResponseDescription = 'forResponseDescription'
  myOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy'
  };

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user);
    this.User = this.auth.authState;
    this.getUserValue();
    this.buildForm(),
      this.dropdownSettings = {
        singleSelection: false,
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        noDataAvailablePlaceholderText: 'Please choose site or site does not have module',
        itemsShowLimit: 3,
        allowSearchFilter: true,
        enableCheckAll: false
      };
    this.setDateDefault()
    this.setAssign()
    this.getActionSentence()
  }

  getUserValue() {
    this.userService.getUserbyId(this.User.uid).snapshotChanges().subscribe(data => {
      this.user$ = data.payload.data() as User;
      if (this.user$.roles.customer === true) {
        this.setCreator();
        this.setSource();
        this.setType();
        this.setPriority();
        this.setStatusCustomer();
        this.getSiteCustomer();
        this.getCustomerContact(this.user$.name);
        this.setActionSentenceCus();
        this.setParticipantCustomer()
      } else {
        this.setStaff();
        this.setParticipant()
        this.setStatus();
        this.site$ = this.siteService.getSitesList();
        this.setActionSentence()
      }
    });
  }

  setSource() {
    this.addTicketForm.patchValue({
      source: 'Website'
    });
  }

  setType() {
    this.addTicketForm.patchValue({
      type: 'Undefined'
    });
  }

  getSiteCustomer() {
    this.site$ = this.siteService.getSiteByName(this.user$.site);
    this.site$.subscribe((siteData: Site[]) => {
      this.Site = siteData;
      this.setSite();
    });
  }

  setStaff() {
    this.addTicketForm.patchValue({
      staff: this.user$.fullName
    });
  }

  setParticipantCustomer() {
    this.addTicketForm.patchValue({
      participant: []
    });
  }

  setParticipant() {
    this.addTicketForm.patchValue({
      participant: [this.user$.fullName]
    });
  }

  setCreator() {
    this.addTicketForm.patchValue({
      creator: this.user$.firstName + ' ' + this.user$.lastName
    });
  }

  setSite() {
    this.addTicketForm.patchValue({
      site: this.Site[0]
    });
  }

  setStatus() {
    this.addTicketForm.patchValue({
      status: 'Draft'
    });
  }

  setStatusCustomer() {
    this.addTicketForm.patchValue({
      status: 'Informed'
    });
  }

  setPriority() {
    this.addTicketForm.patchValue({
      priority: 'Undefined'
    });
  }

  setAssign() {
    this.addTicketForm.patchValue({
      assign: ''
    });
  }

  getActionSentence() {
    this.addTicketForm.patchValue({
      actionSentence: ''
    });
  }

  setActionSentence() {
    let sentence: string
    const userCurrent = this.getCurrentUser()
    if (this.user$.roles.supporter === true) {
      if (this.status.value === 'Draft') {
        sentence = `${userCurrent} create draft`
      } else if (this.status.value === 'Informed') {
        sentence = `${userCurrent} create ticket`
      } else if (this.status.value === 'Rejected') {
        sentence = `${userCurrent} rejected ticket`
      } else if (this.status.value === 'Closed') {
        sentence = `${userCurrent} closed ticket`
      } else if (this.status.value === 'In Progress') {
        sentence = `${userCurrent} set in progress`
      }
    }
    this.addTicketForm.patchValue({
      actionSentence: sentence
    })
  }

  setActionSentenceCus() {
    const userCurrent = this.getCurrentUser()
    this.addTicketForm.patchValue({
      actionSentence: `${userCurrent} create ticket`
    })
  }

  buildForm() {
    const model: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() }, dateRange: null };
    this.addTicketForm = this.fb.group({
      date: [model, [Validators.required]],
      source: ['', [Validators.required]],
      site: ['', [Validators.required]],
      module: [''],
      creator: ['', [Validators.required]],
      type: ['', [Validators.required]],
      subject: ['', [
        Validators.required,
        Validators.maxLength(200)]
      ],
      priority: ['', [Validators.required]],
      description: ['', [
        Validators.required,
        Validators.maxLength(2000)]
      ],
      responseDescription: [''],
      responseDescriptionFile: [''],
      status: [''],
      staff: [''],
      email: [''],
      assign: [''],
      descriptionFile: [''],
      actionSentence: [''],
      participant: ['']
    });
  }

  hideTextArea(type: any) {
    if (type === 'Info' || type === 'Consult') {
      this.hideResponse = true;
      this.removeStatus('In Progress');
      this.isResponseDescription(Event)
    } else if (type === 'Problem' || type === 'Add-ons') {
      this.hideResponse = false;
      this.removeStatus('Closed');
      this.addStatus('In Progress');
    }
  }

  isResponseDescription(event: any) {
    (this.addTicketForm.controls.responseDescription.value) ? this.addStatus('Closed') : this.removeStatus('Closed')
  }

  removeStatus(status: string) {
    if (status === 'Closed') {
      this.setStatus()
    }
    this.Status = this.Status.filter(item => item.value !== status)
  }

  addStatus(status: string) {
    if (this.Status.some(item => item.value === status)) {
      console.log('Object found inside the array.');
    } else {
      let name: string;
      let value: string;
      switch (status) {
        case 'Closed':
          this.setStatus()
          name = 'Save as Close'
          value = status
          break;
        case 'In Progress':
          this.setStatus()
          name = 'Save as In Progress'
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

  addTicketData() {
    this.ticketService.addTicket(this.addTicketForm.value, this.user.roles);
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
    this.addTicketForm.patchValue({
      status: value
    });
    this.setActionSentence()
  }

  isSelectedSite() {
    if (this.addTicketForm.controls.site.value) {
      this.getModule();
      this.getCreate();
      return true;
    } else {
      this.getModule();
    }
    return false;
  }

  getMaPackage() {
    const maStartDate = moment(this.addTicketForm.controls.site.value.maStartDate).format('DD/MM/YYYY');
    const maEndDate = moment(this.addTicketForm.controls.site.value.maEndDate).format('DD/MM/YYYY');
    return maStartDate + ' - ' + maEndDate;
  }

  getProductName() {
    return this.addTicketForm.controls.site.value.product.name;
  }

  getModule() {
    if (this.addTicketForm.controls.site.value.module) {
      this.moduleList = this.addTicketForm.controls.site.value.module;
      this.moduleList.sort((a, b) => a.localeCompare(b));
    } else {
      this.moduleList = [];
    }
    return this.moduleList;
  }

  getDev() {
    return this.addTicketForm.controls.staff.value.firstName;
  }

  getCurrentUser() {
    return this.user$.firstName + ' ' + this.user$.lastName
  }


  getCreate() {
    return this.addTicketForm.controls.site.value.users;
  }

  setDateDefault(): void {
    const date = new Date();
    this.addTicketForm.patchValue({
      date: {
        dateRange: null,
        isRange: false,
        singleDate: {
          date: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
          },
          formatted: this.formatDate(date),
          jsDate: new Date()
        }
      }
    });
  }

  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [day, month, year].join('/');
  }

  getCustomerContact(name: string) {
    this.userService.getUserbyName(name).snapshotChanges().subscribe(data => {
      data.map(a => {
        const data = a.payload.doc.data() as User
        const id = a.payload.doc['id']
        this.setEmail(data)
        return { id, ...data }
      })
    })
  }

  setEmail(data: User) {
    this.addTicketForm.patchValue({
      email: data.email
    });
  }

  alertCancelTicket() {
    Swal.fire({
      title: 'Do you want to cancel add ticket.',
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
        }
      }
    })
  }

  deleteCollection(collection) {
    this.ticketService.deleteCollection(collection)
  }

  public onUploadDescriptionFile(upload: any): void {
    this.addTicketForm.patchValue({
      descriptionFile: upload
    });
  }

  public onUploadResponseDescriptionFile(upload: any): void {
    this.addTicketForm.patchValue({
      responseDescriptionFile: upload
    });
  }

}
