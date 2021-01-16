import { async } from '@angular/core/testing';
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

  getTicketsListByStatusFilter(status: string) {
    return this.afs.collection('ticket', ref => ref
      .where('status', '==', status)
      .orderBy('date', 'desc')
    )
  }

  getTicketsListByFilter(status: string, creater: string) {
    console.log(status)
    console.log(creater)
    return this.afs.collection('ticket', ref => ref
      .where('status', '==', status)
      .where('staff', '==', creater)
      .orderBy('date', 'desc')
    )
  }

  async cancelTicket(id) {
    try {
      this.afs.collection('ticket').doc(id).update({
        status: 'Cancel'
      });
      this.successNotification();
    } catch (error) {
      this.errorNotification();
    }
  }

  async changeStatusPendingById(id) {
    try {
      this.afs.collection('ticket').doc(id).update({
        status: 'Pending'
      })
      this.successNotification();
    } catch (error) {
      this.errorNotification();
    }
  }

  async changeStatusCloseById(id) {
    try {
      this.afs.collection('ticket').doc(id).update({
        status: 'Close'
      })
      this.successNotification();
    } catch (error) {
      this.errorNotification();
    }
  }

  async changePriority(id, priority: any) {
    try {
      this.afs.collection('ticket').doc(id).update({
        priority
      })
    } catch (error) {
      console.log(error);
    }
  }

  async changeType(id, type: any) {
    try {
      this.afs.collection('ticket').doc(id).update({
        type
      })
    } catch (error) {
      console.log(error);
    }
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

  // editTicket(ticket: Ticket) {
  //   this.afs.collection('ticket').doc('ticket').update({
  //     date: ticket.date,
  //     source: ticket.source,
  //     site: ticket.site,
  //     module: ticket.module,
  //     creater: ticket.creater,
  //     type: ticket.type,
  //     subject: ticket.subject,
  //     priority: ticket.priority,
  //     description: ticket.description,
  //     resolveDescription: ticket.resolveDescription,
  //     status: ticket.status,
  //     staff: ticket.staff
  //   })
  // }

  getByKeyWord(value: any) {
    return this.afs.collection('ticket', (ref) => ref
      .orderBy('subject')
      .startAt(value)
      .endAt(value + '\uf8ff'));
  }

  getTicketByid(id: any) {
    return this.afs.doc<Ticket>(`ticket/` + id).valueChanges();
  }

  getCountByStatus(status: string) {
    return this.afs.collection('ticket', ref => ref.where('status', '==', status)).valueChanges();
  }

  getCountByStatusCurrentname(status: string, creater: string) {
    return this.afs.collection('ticket', ref => ref
      .where('status', '==', status)
      .where('staff', '==', creater)
    ).valueChanges();
  }

  getTicketsList() {
    return this.afs.collection('ticket', ref => ref
      .where('status', 'in', ['Draft', 'More Info', 'Pending', 'Resolved', 'Close'])
      .orderBy('date', 'desc')
    );
  }

  getTicketsListCurrentname(creater: string) {
    return this.afs.collection('ticket', ref => ref
      .where('status', 'in', ['Draft', 'More Info', 'Pending', 'Resolved', 'Close'])
      .where('staff', '==', creater)
      .orderBy('date', 'desc')
    );
  }
}
