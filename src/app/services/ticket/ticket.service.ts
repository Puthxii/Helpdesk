import { AngularFirestore, fromDocRef } from 'angularfire2/firestore';
import { Ticket } from './ticket.model';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor(
    private afs: AngularFirestore
  ) { }

  successNotification() {
    Swal.fire({
      text: 'Your ticket has been saved',
      icon: 'success',
    }).then((result) => {
      window.location.href = './../ticket';
    });
  }

  errorNotification() {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Your ticket has not been saved',
    }).then((result) => {
      window.location.href = './../ticket';
    });
  }

  getTicketsList() {
    return this.afs.collection('ticket', ref => ref.orderBy('date', 'desc'));
  }

  async addTicket(ticket: Ticket) {
    try {
      this.afs.collection('ticket').add({
        date: ticket.date,
        source: ticket.source,
        site: ticket.site,
        module: ticket.module,
        creater: ticket.creater,
        type: ticket.type,
        subject: ticket.subject,
        priority: ticket.priority,
        description: ticket.description,
        resolveDescription: ticket.resolveDescription,
        status: ticket.status,
        staff: ticket.staff
      });
      this.successNotification();
    } catch (error) {
      this.errorNotification();
    }
  }

  getByKeyWord(value: any) {
    return this.afs.collection('ticket', (ref) => ref
      .orderBy('site.initials')
      .startAt(value)
      .endAt(value + '\uf8ff'))
  }

  getTicketByid(id: any) {
    return this.afs.doc<Ticket>(`ticket/` + id).valueChanges();
  }
}
