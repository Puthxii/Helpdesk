import { async } from '@angular/core/testing';
import { UserService } from 'src/app/services/user/user.service';
import { Product } from './../../services/product/product.model';
import { ProductService } from './../../services/product/product.service';
import { SiteService } from './../../services/site/site.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TicketService } from 'src/app/services/ticket/ticket.service';
import * as moment from 'moment';
import { Site } from 'src/app/services/site/site.model';
import { Observable, Subscription } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/services/user.model';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.scss'],
})
export class AddTicketComponent implements OnInit {
  user;
  Product: Product;
  site$: Observable<any>;
  user$: any;
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
    { name: 'Website' },
    { name: 'Facebook' },
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
    { name: 'Save as draft', value: 'draft' },
    { name: 'Save as pending', value: 'pending' },
    { name: 'Save as close', value: 'close' }
  ];

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
      console.log(this.user$);
      if (this.user$.roles.customer === true) {
        this.site$ = this.siteService.getSiteByName(this.user$.site);
      } else {
        this.site$ = this.siteService.getSitesList();
      }
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
    this.addTicketForm = this.fb.group({
      date: ['', [Validators.required]],
      source: ['', [Validators.required]],
      site: ['', [Validators.required]],
      module: [''],
      creater: ['', [Validators.required]],
      type: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      description: ['', [Validators.required]],
      resolveDescription: [''],
      status: ['']
    });
  }

  hideTextArea(type: any) {
    if (type === 'info' || type === 'consult') {
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
    if (this.addTicketForm.controls.site.value && this.addTicketForm.controls.module) {
      this.addTicketForm.controls.module.reset('', {
        emitModelToViewChange: false
      });
      this.getModule();
      this.getCreate();
      return true;
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
