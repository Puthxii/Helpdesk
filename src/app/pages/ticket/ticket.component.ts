import { TicketService } from 'src/app/services/ticket/ticket.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
  searchValue = '';
  constructor(public ticketService: TicketService) { }

  ngOnInit() {
  }

  search() {
    const value = this.searchValue;
    this.ticketService.getByKeyWord(value).snapshotChanges().subscribe(data => {
      data.map(items => {
        const item = items.payload.doc.data();
        item['$id'] = items.payload.doc.id;
        console.log(item);
      });
    });
  }

}
