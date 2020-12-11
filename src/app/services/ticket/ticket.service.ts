import { Ticket } from './ticket.model';
import { Injectable } from '@angular/core';
import { AngularFireList } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  ticketRef: AngularFireList<any>

  constructor() { }

  addTicket(ticket: Ticket) {
    this.ticketRef.push({
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
