import { Product } from './../../services/product/product.model';
import { ProductService } from './../../services/product/product.service';
import { SiteService } from './../../services/site/site.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TicketService } from 'src/app/services/ticket/ticket.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as moment from 'moment';
import { Site } from 'src/app/services/site/site.model';
import { Observable } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.scss'],
})
export class AddTicketComponent implements OnInit {
  Product: Product;
  site$: Observable<any>;

  constructor(
    public ticketService: TicketService,
    public siteService: SiteService,
    public productService: ProductService,
    public fb: FormBuilder
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
  Site: Site[];
  Sources = [
    { name: 'website' },
    { name: 'Facebook' },
    { name: 'Line' },
    { name: 'Email' },
    { name: 'Telephone' },
    { name: 'Onsite' }
  ];

  Types = [
    { name: 'info' },
    { name: 'consult' },
    { name: 'problem' },
    { name: 'add-ons' }
  ];

  Prioritys = [
    { name: 'low' },
    { name: 'medium' },
    { name: 'high' }
  ];

  Status = [
    { name: 'Save as draft', value: 'draft' },
    { name: 'Save as pending', value: 'pending' },
    { name: 'Save as close', value: 'close' }
  ];

  ngOnInit() {
    this.buildForm(),
      this.dropdownList = [
        { item_id: 1, item_text: 'Mumbai' },
        { item_id: 2, item_text: 'Bangaluru' },
        { item_id: 3, item_text: 'Pune' },
        { item_id: 4, item_text: 'Navsari' },
        { item_id: 5, item_text: 'New Delhi' }
      ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false,
      enableCheckAll: false
    };
    this.site$ = this.siteService.getSitesList();
  }

  successNotification() {
    Swal.fire({
      text: 'Your ticket has been saved',
      icon: 'success',
    }).then((result) => {
      window.location.href = './../ticket';
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

  displaySelectedStatus(): string {
    return (this.status.value) ? 'as ' + this.status.value : '';
  }

  onSelectedStatus(status: string) {
    this.addTicketForm.patchValue({
      status
    });
  }

  isSelectedSite() {
    return this.addTicketForm.controls.site.value;
  }

  getMaLevelName() {
    const maStartDate = moment(this.addTicketForm.controls.site.value.maStartDate).format('DD/MM/YYYY');
    const maEndDate = moment(this.addTicketForm.controls.site.value.maEndDate).format('DD/MM/YYYY');
    return maStartDate + ' - ' + maEndDate;
  }

  getProductName() {
    return this.addTicketForm.controls.site.value.product.name;
  }

  getModule() {
    return this.addTicketForm.controls.site.value.module;
  }
}



