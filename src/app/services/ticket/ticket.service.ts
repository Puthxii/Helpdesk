import { Subject } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
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

  successCancel() {
    Swal.fire({
      text: 'Your ticket has been saved',
      icon: 'success',
    }).then((result) => {
    });
  }

  errorCancel() {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Your ticket has not been saved',
    }).then((result) => {
    });
  }
  confirmCancel() {
    Swal.fire(
      'Deleted!',
      'Your file has been deleted.',
      'success'
    )
  }

  getTicketsListByStatusFilter(status: string) {
    return this.afs.collection('ticket', ref => ref
      .where('status', '==', status)
      .orderBy('date', 'desc')
    )
  }

  getTicketsListByFilter(status: string, creater: string) {
    return this.afs.collection('ticket', ref => ref
      .where('status', '==', status)
      .where('staff', '==', creater)
      .orderBy('date', 'desc')
    )
  }

  async cancelTicket(id, subject) {
    try {
      Swal.fire({
        title: 'Are you sure delete',
        text: subject,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.cancelticket(id)
          this.confirmCancel()
        }
      })
    } catch (error) {
      this.errorNotification();
    }
  }

  cancelticket(id) {
    this.afs.collection('ticket').doc(id).update({
      status: 'Cancel'
    })
  }

    async changeStatus(id, status: any, staff: any) {
    try {
      console.log(id, status, staff)
      this.afs.collection('ticket').doc(id).update({
        status
      })
      this.setAction(id, status, staff)
      this.successCancel();
    } catch (error) {
      this.errorCancel();
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
        staff: ticket.staff,
        action: [{
          staff : ticket.staff,
          status: ticket.status,
          date: new Date(),
        }]
      });
      this.successNotification();
      // this.setAction(id, staff, status);
    } catch (error) {
      this.errorNotification();
    }
  }

  setAction(id: any, status: string, staff: any) {
      this.afs.collection('ticket').doc(id).set({
           action: [{
            staff,
            status,
            date: new Date(),
        }]
      },
    )
  }

  getByKeyWord(keword: any) {
    return this.afs.collection('ticket', (ref) => ref
      .orderBy('subject')
      .startAt(keword)
      .endAt(keword + '\uf8ff'));
  }

  getByStatus(keword: string, status: string) {
    return this.afs.collection('ticket', (ref) => ref
      .where('status', '==', status)
      .orderBy('subject')
      .startAt(keword)
      .endAt(keword + '\uf8ff'));
  }

  getByCurrentnameStatus(keword: string, currentName: string, status: string) {
    return this.afs.collection('ticket', (ref) => ref
      .where('status', '==', status)
      .where('staff', '==', currentName)
      .orderBy('subject')
      .startAt(keword)
      .endAt(keword + '\uf8ff'));
  }

  getByCurrentname(keword: string, currentName: string) {
    return this.afs.collection('ticket', (ref) => ref
      .where('staff', '==', currentName)
      .orderBy('subject')
      .startAt(keword)
      .endAt(keword + '\uf8ff'));
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

  getByDaterange(startDate, endDate) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>', startDate)
      .where('date.singleDate.jsDate', '<', endDate)
    );
  }

  getByCurrentnameStatusKewordDateRange(keword: any, creater: string, status: string, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>', startDate)
      .where('date.singleDate.jsDate', '<', endDate)
      .where('staff', '==', creater)
      .where('status', '==', status)
      .where('subject', '==', keword)
    );
  }

  getByCurrentnameStatusDateRange(creater: string, status: string, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>', startDate)
      .where('date.singleDate.jsDate', '<', endDate)
      .where('staff', '==', creater)
      .where('status', '==', status)
    );
  }

  getByStatusKewordDateRange(keword: any, status: string, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>', startDate)
      .where('date.singleDate.jsDate', '<', endDate)
      .where('status', '==', status)
      .where('subject', '==', keword)
    );
  }

  getByCurrentnameKewordDateRange(keword: any, creater: string, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>', startDate)
      .where('date.singleDate.jsDate', '<', endDate)
      .where('staff', '==', creater)
      .where('subject', '==', keword)
    );
  }

  getByCurrentnameDateRange(creater: string, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>', startDate)
      .where('date.singleDate.jsDate', '<', endDate)
      .where('staff', '==', creater)
    );
  }

  getByKewordDaterange(keword: any, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>', startDate)
      .where('date.singleDate.jsDate', '<', endDate)
      .where('subject', '==', keword)
    );
  }

  getByStatusDateRange(status: string, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>', startDate)
      .where('date.singleDate.jsDate', '<', endDate)
      .where('status', '==', status)
    );
  }

}
