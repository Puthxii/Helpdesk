import { Ticket } from './../../services/ticket/ticket.model';
import { TicketService } from './../../services/ticket/ticket.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
  searchValue = '';
  Ticket: Ticket[];
  ticket$: Observable<Ticket[]>;

  ticket: any;
  id: string;
  
  startIndex = 0;
  endIndex = 7;

  constructor(
    private ticketService: TicketService,
  ) {
  }
  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.ticket$ = this.ticketService.getTicketsList()
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );          
  }

  getBySearch(value) {
    this.ticket$ = this.ticketService.getByKeyWord(value)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  search() {
    const value = this.searchValue;
    value ? this.getBySearch(value) : this.getAll()
  }

  getArrayFromNumber(length){
    return new Array(Math.ceil(length/7))

  }

  updateIndex(pageIndex){
    this.startIndex = pageIndex * 7;
    this.endIndex = this.startIndex + 7;
  } 
}
