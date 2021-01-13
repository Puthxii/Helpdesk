import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css']
})
export class EditTicketComponent implements OnInit {
  dropdownSettings: IDropdownSettings;
  id: string;
  
  constructor(
    private route: ActivatedRoute,
  ) {
    this.route.params.subscribe(params => this.id = params.id);
   }

  ngOnInit() {
  }

}
