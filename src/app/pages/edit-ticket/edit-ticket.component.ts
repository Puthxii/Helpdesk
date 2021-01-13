import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Observable } from 'rxjs/internal/Observable';
import { Ticket } from 'src/app/services/ticket/ticket.model';
import { TicketService } from 'src/app/services/ticket/ticket.service';

@Component({
  selector: 'edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css']
})
export class EditTicketComponent implements OnInit {
  dropdownSettings: IDropdownSettings;
  id: string;
  ticket$: Observable<Ticket>;
  public editTicket: FormGroup;

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
  ) {
    this.route.params.subscribe(params => this.id = params.id)
  }

  ngOnInit() {
    this.upadateTicketForm()
    this.ticketService.getTicketByid(this.id).subscribe(data => {
      this.editTicket.setValue(data)
    })
  }

  // get date(){
  //  return this.editTicket.get('date') 
  // }

  // get source() {
  //   return this.editTicket.get('source');
  // }

  // get site() {
  //   return this.editTicket.get('site');
  // }

  // get maintenancePackage() {
  //   return this.editTicket.get('maintenancePackage');
  // }

  // get module() {
  //   return this.editTicket.get('module');
  // }

  // get creater() {
  //   return this.editTicket.get('creater');
  // }

  // get type() {
  //   return this.editTicket.get('type');
  // }

  // get subject() {
  //   return this.editTicket.get('subject');
  // }

  // get priority() {
  //   return this.editTicket.get('priority');
  // }

  // get description() {
  //   return this.editTicket.get('description');
  // }

  // get resolveDescription() {
  //   return this.editTicket.get('resolveDescription');
  // }

  // get status() {
  //   return this.editTicket.get('status');
  // }

  upadateTicketForm() {
    this.editTicket = this.fb.group({
      date: [''],
      source: [''],
      site: [''],
      module: [''],
      creater: [''],
      // maintenancePackage: [''],
      // product: [''],
      type: [''],
      subject: [''],
      priority: [''],
      description: [''],
      resolveDescription: [''],
      status: [''],
      staff: [''],
    });
  }

  upadateForm() {
    // this.ticketService.editTicket(this.editTicket.value);
  }
}