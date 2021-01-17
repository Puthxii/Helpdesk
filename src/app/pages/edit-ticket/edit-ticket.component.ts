import { SiteService } from './../../services/site/site.service';
import { Site } from './../../services/site/site.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  site$: Observable<any>;
  dropdownSettings: IDropdownSettings;
  id: string;
  ticket$: Observable<Ticket>;
  public editTicket: FormGroup;
  moduleList: any[];
  Site: Site[];
  Sources = [
    { name: 'Facebook', },
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

  ticket: any;

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private siteService: SiteService,
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
  ) {
    this.route.params.subscribe(params => this.id = params.id)
  }

  ngOnInit() {
    this.upadateTicketForm()
    this.ticketService.getTicketByid(this.id).subscribe(data => {
      this.ticket = data
      this.editTicket.patchValue({
        date: this.ticket.date,
        source: this.ticket.source,
        site: this.ticket.site,
        module: this.ticket.module,
        creater: this.ticket.creater,
        type: this.ticket.type,
        subject: this.ticket.subject,
        priority: this.ticket.priority,
        description: this.ticket.description,
        resolveDescription: this.ticket.resolveDescription,
        status: this.ticket.status,
        staff: this.ticket.staff,
        siteName: this.ticket.site.nameEN,
      });
      // this.editTicket.setValue(data)
      this.moduleList = this.editTicket.controls.site.value.module
      // this.editTicket.controls.site = this.editTicket.controls.site.value.nameEN
      console.log(this.editTicket);
    })
    this.site$ = this.siteService.getSitesList()
  }

  getCreate() {
    return this.editTicket.controls.site.value.users;
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
      siteName: ['']
    });
  }

  upadateForm() {
    // this.ticketService.editTicket(this.editTicket.value);
  }
}