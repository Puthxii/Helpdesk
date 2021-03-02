import { UserService } from 'src/app/services/user/user.service';
import { Product } from '../../models/product.model';
import { ProductService } from './../../services/product/product.service';
import { SiteService } from './../../services/site/site.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TicketService } from 'src/app/services/ticket/ticket.service';
import * as moment from 'moment';
import { Site } from 'src/app/models/site.model';
import { Observable } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/models/user.model';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import Swal from 'sweetalert2/dist/sweetalert2.js';
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

  get resolveDescription() {
    return this.addTicketForm.get('resolveDescription');
  }

  get status() {
    return this.addTicketForm.get('status');
  }
  users: any;
  user;
  Product: Product;
  site$: Observable<any>;
  user$: any;
  public addTicketForm: FormGroup;
  hideResolve = false;
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
      } else {
        this.setStaff();
        this.setStatus();
        this.site$ = this.siteService.getSitesList();
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
      staff: this.user$.firstName + ' ' + this.user$.lastName
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
      resolveDescription: [''],
      status: [''],
      staff: [''],
      email: ['']
    });
  }

  hideTextArea(type: any) {
    if (type === 'Info' || type === 'Consult') {
      this.hideResolve = true;
      this.removeStatus('In Progress');
      this.isResolveDescription(Event)
    } else if (type === 'Problem' || type === 'Add-ons') {
      this.hideResolve = false;
      this.removeStatus('Closed');
      this.addStatus('In Progress');
    }
  }

  isResolveDescription(event: any) {
    (this.addTicketForm.controls.resolveDescription.value) ? this.addStatus('Closed') : this.removeStatus('Closed')
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
    this.ticketService.addTicket(this.addTicketForm.value);
  }

  displaySelectedStatus(): any {
    return (this.status.value) ? this.mathStatus(this.status.value) : 'Save as draft';
  }

  mathStatus(status): any {
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
          formatted: date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
          jsDate: new Date()
        }
      }
    });
  }

  getCustomerContact(name) {
    this.userService.getUserbyName(name).snapshotChanges().subscribe(data => {
      data.map(a => {
        const data = a.payload.doc.data() as User
        const id = a.payload.doc.id
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
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, I do'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/']);
      }
    })
  }
}
