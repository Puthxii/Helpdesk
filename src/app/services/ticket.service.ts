import { Ticket } from './../ticket.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  ticketsRef: AngularFireList<any>;
  ticketRef: AngularFireObject<any>;
  constructor(private db: AngularFireDatabase) { }
  // Create ticket
  AddTicket(ticket: Ticket) {
      this.ticketsRef.push({
      createDate: ticket.createDate,
      soruce: ticket.soruce,
      siteName: ticket.siteName,
      maintenanceP: ticket.maintenanceP,
      product: ticket.product,
      module: ticket.module,
      creator: ticket.creator,
      type: ticket.type,
      subject: ticket.subject,
      priority: ticket.priority,
      description: ticket.description,
      resolveDes: ticket.resolveDes
    })
  }
  getTickets(id: string) {
    this.ticketRef = this.db.object('tickets/' + id);
    return this.ticketRef;
  }

  getTicketsList() {
    this.ticketsRef = this.db.list('tickets-list');
    return this.ticketsRef;
  }
}


