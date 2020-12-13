import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TicketService } from 'src/app/services/ticket/ticket.service';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.scss']
})
export class AddTicketComponent implements OnInit {
  public addTicketForm: FormGroup;

  constructor(
    public ticketService: TicketService,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    this.ticketService.getTicketsList();
    this.buildForm()
  }

  sources = [
    { name: 'email' },
    { name: 'call', }
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
      date: [''],
      source: [''],
      siteName: [''],
      maintenancePackage: [''],
      product: [''],
      module: [''],
      creater: [''],
      type: [''],
      subject: [''],
      priority: [''],
      description: [''],
      resolveDescription: [''],
    })
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

