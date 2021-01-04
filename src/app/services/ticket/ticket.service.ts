import { AngularFirestore, fromDocRef } from 'angularfire2/firestore';
import { Ticket } from './ticket.model';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import Swal from 'sweetalert2/dist/sweetalert2.js';

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

  successNotification() {
    Swal.fire({
      text: 'Your ticket has been saved',
      icon: 'success',
    }).then((result) => {
      window.location.href = "./../ticket";
    });
  }

  errorNotification() {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Your ticket has not been saved',
    }).then((result) => {
      window.location.href = "./../ticket";
    });
  }

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
        });
        this.successNotification();
      } catch (error) {
        this.errorNotification();
      }
  }

  //TODO : Get by ID

  //TODO : UPDATE

  //TODO : DELETE 
}
