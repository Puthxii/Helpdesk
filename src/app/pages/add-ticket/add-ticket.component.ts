import { UserService } from 'src/app/services/user/user.service';
import { Product } from './../../services/product/product.model';
import { ProductService } from './../../services/product/product.service';
import { SiteService } from './../../services/site/site.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TicketService } from 'src/app/services/ticket/ticket.service';
import * as moment from 'moment';
import { Site } from 'src/app/services/site/site.model';
import { Observable } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/services/user.model';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';

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
    public userService: UserService
  ) { }

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

  get creater() {
    return this.addTicketForm.get('creater');
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
  Sources = [
    { name: 'Facebook',},
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
    { name: 'Save as draft', value: 'Draft' },
    { name: 'Save as pending', value: 'Pending' },
    { name: 'Save as close', value: 'Close' }
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
    this.setDate();
    this.setStatus();
  }

  getUserValue() {
    this.userService.getUserbyId(this.User.uid).snapshotChanges().subscribe(data => {
      this.user$ = data.payload.data() as User;
      if (this.user$.roles.customer === true) {
        this.setCreater();
        this.setSource();
        this.getSiteCustomer();
      } else {
        this.setStaff();
        this.site$ = this.siteService.getSitesList();
      }
    });
  }

  setSource() {
    this.addTicketForm.patchValue({
      source: 'Website'
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

  setCreater() {
    this.addTicketForm.patchValue({
      creater: this.user$.firstName + ' ' + this.user$.lastName
    });
  }

  setSite() {
    this.addTicketForm.patchValue({
      site: this.Site[0]
    });
  }

  setDate() {
    this.addTicketForm.patchValue({
      date: this.maxDate
    });
  }

  setStatus() {
    this.addTicketForm.patchValue({
      status: 'draft'
    });
  }

  buildForm() {
    const model: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() }, dateRange: null };
    this.addTicketForm = this.fb.group({
      date: [model, [Validators.required]],
      source: ['', [Validators.required]],
      site: ['', [Validators.required]],
      module: [''],
      creater: ['', [Validators.required]],
      type: [''],
      subject: ['', [
        Validators.required,
        Validators.maxLength(50)]
      ],
      priority: [''],
      description: ['', [
        Validators.required,
        Validators.maxLength(250)]
      ],
      resolveDescription: [''],
      status: [''],
      staff: ['']
    });
  }

  hideTextArea(type: any) {
    if (type === 'Info' || type === 'Consult') {
      this.hideResolve = true;
    } else {
      this.hideResolve = false;
    }
  }

  addTicketData() {
    this.ticketService.addTicket(this.addTicketForm.value);
  }

  displaySelectedStatus(): any {
    return (this.status.value) ? 'Save as ' + this.status.value : 'Save as draft';
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

  getCreate() {
    return this.addTicketForm.controls.site.value.users;
  }

}
