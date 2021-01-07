import { TicketService } from 'src/app/services/ticket/ticket.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {

  constructor(public ticketService: TicketService) { }

  ngOnInit() {
    this.ticketService.getByKeyWord('WU')
  }

}
