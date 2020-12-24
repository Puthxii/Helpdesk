import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TicketService } from 'src/app/services/ticket/ticket.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.scss'],
})
export class AddTicketComponent implements OnInit {
  public addTicketForm: FormGroup;
  hideResolve = false;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings:IDropdownSettings

  maxDate = moment(new Date()).format('DD-MM-YYYY');
  minDate = moment().subtract(1, 'months').format('DD-MM-YYYY');
  
  constructor(
    public ticketService: TicketService,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm(),
    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' }
    ];      
    console.log(this.selectedItems)
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
  }

  successNotification(){
    Swal.fire({
      text: 'Your ticket has been saved',
      icon: 'success',
    }).then((result) => {
      window.location.href = "./../ticket";
    })
  } 

  sources = [
    { name: 'website' },
    { name: 'Facebook' },
    { name: 'Line' },
    { name: 'Email' },
    { name: 'Telephone' },
    { name: 'Onsite' }
  ]

  types = [
    { name: 'info' },
    { name: 'consult' },
    { name: 'problem' },
    { name: 'add-ons' }
  ]

  prioritys = [
    { name: 'low' },
    { name: 'medium' },
    { name: 'high' }
  ]

  buildForm() {
    this.addTicketForm = this.fb.group({
      date: ['', [Validators.required]],
      source: ['', [Validators.required]],
      siteName: ['', [Validators.required]],
      maintenancePackage: ['', [Validators.required]],
      product: ['', [Validators.required]],
      module: ['', [Validators.required]],
      creater: ['', [Validators.required]],
      type: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      description: ['', [Validators.required]],
      resolveDescription: [''],
    })
  }

  hideTextArea(type: any) {
    if (type === 'info' || type === 'consult'){
      this.hideResolve = true
    } else {
      this.hideResolve = false
    }
  }

  get date() {
    return this.addTicketForm.get('date');
  }

  get source() {
    return this.addTicketForm.get('source');
  }

  get siteName() {
    return this.addTicketForm.get('siteName');
  }

  get maintenancePackage() {
    return this.addTicketForm.get('maintenancePackage');
  }

  get product() {
    return this.addTicketForm.get('product');
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

  addTicketData() {
    this.ticketService.addTicket(this.addTicketForm.value);
  }

}

