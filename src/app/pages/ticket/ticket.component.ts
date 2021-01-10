import { Ticket } from './../../services/ticket/ticket.model';
import { TicketService } from './../../services/ticket/ticket.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
  Ticket: Ticket[];

  constructor(
    private ticketService: TicketService
  ) { }

  ngOnInit() {
    this.ticketService.getTicketsList().subscribe( data => {
      this.Ticket = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$id'] = items.payload.doc.id;
        this.Ticket.push(item as Ticket)
      })
    })
  }

}
