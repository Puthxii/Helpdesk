import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TicketService } from 'src/app/services/ticket/ticket.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as moment from 'moment';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.scss']
})
export class AddTicketComponent implements OnInit {
  constructor(
    public ticketService: TicketService,
    public fb: FormBuilder
  ) { }

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

  get status() {
    return this.addTicketForm.get('status');
  }
  public addTicketForm: FormGroup;
  hideResolve = false;
  maxDate = moment(new Date()).format('DD-MM-YYYY');
  minDate = moment().subtract(1, 'months').format('DD-MM-YYYY');

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
    this.buildForm();
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
      siteName: ['', [Validators.required]],
      maintenancePackage: ['', [Validators.required]],
      product: ['', [Validators.required]],
      module: ['', [Validators.required]],
      creater: ['', [Validators.required]],
      type: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      description: ['', [Validators.required]],
      resolveDescription: ['', [Validators.required]],
      status: ['']
    });
  }

  hideTextArea(type: any) {
    if (type === 'info' || type === 'consult') {
      this.hideResolve = true
    } else {
      this.hideResolve = false
    }
  }

  addTicketData() {
    this.ticketService.addTicket(this.addTicketForm.value);
  }

  displaySelectedStatus(): string {
    return (this.status.value) ? 'as ' + this.status.value : ''
  }

  onSelectedStatus(status: string) {
    this.addTicketForm.patchValue({
      status
    });
  }
}

