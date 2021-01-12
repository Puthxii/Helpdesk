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
  status: string;
  countAll: number;
  Status = [
    { value: 'draft' },
    { value: 'more_info' },
    { value: 'pending' },
    { value: 'resolved' },
    { value: 'close' }
  ]
  CountStatus = []

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

 
  startIndex = 0;
  endIndex = 7;

  constructor(
    private ticketService: TicketService,
  ) {
  }
  ngOnInit() {
    this.getCountByStatus();
    this.getCountAll();
    this.status = 'draft';
    this.getByStatus(this.status);
  }

  getCountByStatus() {
    for (let i = 0; this.Status.length > i; i++) {
      this.ticketService.getCountByStatus(this.Status[i].value).subscribe(result => {
        this.CountStatus[i] = result.length;
      });
    }
  }

  getCountAll() {
    this.ticketService.getTicketsList().valueChanges().subscribe(result => {
      this.countAll = result.length;
    });
  }

  getByStatus(status: string) {
    this.ticket$ = this.ticketService.getTicketsListByStatus(status)
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );          
  }

  onSelectedDelete(id) {
    this.ticketService.changeStatusTicket(id)
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
    value ? this.getBySearch(value) : this.getByStatus('draft')
  }

  isDraft(ticket) {
    return ticket.status == 'draft'
  }

  setStatus(status: string) {
    this.getByStatus(status)
  }

  getAllTicket() {
    this.ticket$ = this.ticketService.getTicketsList().snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Ticket;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getArrayFromNumber(length){
    return new Array(Math.ceil(length/7))

  }

  updateIndex(pageIndex){
    this.startIndex = pageIndex * 7;
    this.endIndex = this.startIndex + 7;
  } 
}
