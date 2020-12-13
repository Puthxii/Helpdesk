import { Ticket } from './../../ticket.model';
import { Component, OnInit } from '@angular/core';
import { TicketService } from './../../services/ticket.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.scss']
})
export class AddTicketComponent implements OnInit {
  public ticketForm: FormGroup;
  constructor(
    public ticketAPI: TicketService,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    this.ticketAPI.getTicketsList();
  }
  get createDate() {
    return this.ticketForm.get('createDate');
  }
  get soruce() {
    return this.ticketForm.get('soruce');
  }
  get siteName() {
    return this.ticketForm.get('siteName');
  }
  get maintenanceP() {
    return this.ticketForm.get('maintenanceP');
  }
  get product() {
    return this.product.get('product');
  }
  get module() {
    return this.module.get('module');
  }
  get creator() {
    return this.creator.get('creator');
  }
  get type() {
    return this.type.get('type');
  }
  get subject() {
    return this.subject.get('subject');
  }
  get priority() {
    return this.priority.get('priority');
  }
  get description() {
    return this.description.get('description');
  }
  get resolveDes() {
    return this.resolveDes.get('resolveDes');
  }
  ResetForm() {
    this.ticketForm.reset();
  }

  submitTicketData() {
    this.ticketAPI.AddTicket(this.ticketForm.value); // Submit student data using CRUD API
    this.ResetForm();  // Reset form when clicked on reset button
  }
}
