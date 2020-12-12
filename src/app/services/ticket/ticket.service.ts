import { Ticket } from './ticket.model';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  ticketsRef: AngularFireList<any>
  ticketRef: AngularFireObject<any>

  constructor(private db: AngularFireDatabase) { }

  getTicketsList() {
    this.ticketsRef = this.db.list('ticket');
    return this.ticketsRef;
  }

  addTicket(ticket: Ticket) {
    console.log(ticket)
    this.ticketsRef.push({
      date: ticket.date,
      source: ticket.source,
      siteName: ticket.siteName,
      maintenancePackage: ticket.maintenancePackage,
      product: ticket.product,
      module: ticket.module,
      creater: ticket.creater,
      type: ticket.type,
      subject: ticket.subject,
      priority: ticket.priority,
      description: ticket.description,
      resolveDescription: ticket.resolveDescription
    })
  }

}
