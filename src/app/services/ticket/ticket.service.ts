import { AngularFirestore, fromDocRef } from 'angularfire2/firestore';
import { Ticket } from './ticket.model';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';


@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getTicketsList() {
    return this.afs.collection('ticket').snapshotChanges();
  }

<<<<<<< HEAD
  async addTicket(ticket: Ticket) {
      try {
        this.afs.collection('ticket').add({
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
          resolveDescription: ticket.resolveDescription,
        })
        console.log('succes');
      } catch (error){
        console.log(error);
      }
=======
  addTicket(ticket: Ticket) {
    this.afs.collection('ticket').add({
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
      resolveDescription: ticket.resolveDescription,
      status: ticket.status
    })
>>>>>>> 970f8db039d83b9f0f3f3e16a228d91216900d21
  }

  //TODO : Get by ID

  //TODO : UPDATE

  //TODO : DELETE 
}
