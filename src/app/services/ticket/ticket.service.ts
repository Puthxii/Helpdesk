import { AngularFirestore } from 'angularfire2/firestore';
import { Ticket } from '../../models/ticket.model';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor(
    private afs: AngularFirestore,
    private router: Router,
  ) { }

  successNotification() {
    Swal.fire({
      text: 'Your ticket has been saved',
      icon: 'success',
    }).then((result: any) => {
      this.router.navigate(['/']);
    });
  }

  errorNotification() {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Your ticket has not been saved',
    }).then((result: any) => {
      this.router.navigate(['/']);
    });
  }

  successCancel() {
    Swal.fire({
      text: 'Your ticket has been saved',
      icon: 'success',
    }).then((result: any) => {
    });
  }

  errorCancel() {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Your ticket has not been saved',
    }).then((result: any) => {
    });
  }

  errorDelete() {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Your ticket has not been delete',
    }).then((result: any) => {
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

  getTicketsListByFilter(status: string, creator: string) {
    return this.afs.collection('ticket', ref => ref
      .where('status', '==', status)
      .where('staff', '==', creator)
      .orderBy('date', 'desc')
    )
  }

  async cancelTicket(id: any, subject: any) {
    try {
      Swal.fire({
        title: 'Are you sure delete',
        text: subject,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result: { isConfirmed: any; }) => {
        if (result.isConfirmed) {
          this.cancelticket(id)
          this.confirmCancel()
        }
      })
    } catch (error) {
      this.errorDelete();
    }
  }

  cancelticket(id: string) {
    this.afs.collection('ticket').doc(id).update({
      status: 'Cancel'
    })
  }

  async changeStatus(id: string, status: any, staff: any) {
    try {
      this.afs.collection('ticket').doc(id).update({
        status
      })
      this.setActionById(id, status, staff)
      this.successCancel();
    } catch (error) {
      this.errorCancel();
    }
  }

  async changePriority(id: string, priority: any) {
    try {
      this.afs.collection('ticket').doc(id).update({
        priority
      })
    } catch (error) {
      console.log(error);
    }
  }

  async changeType(id: string, type: any) {
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
      (await this.afs.collection('ticket').add({
        date: ticket.date,
        source: ticket.source,
        site: ticket.site,
        module: ticket.module,
        creator: ticket.creator,
        type: ticket.type,
        subject: ticket.subject,
        priority: ticket.priority,
        description: ticket.description,
        resolveDescription: ticket.resolveDescription,
        status: ticket.status,
        staff: ticket.staff,
        email: ticket.email
      }))
        .collection('action')
        .add({
          staff: ticket.staff,
          status: ticket.status,
          date: new Date(),
        })
        ;
      this.successNotification();
    } catch (error) {
      this.errorNotification();
    }
  }

  async editTicket(ticket: Ticket, id: any) {
    try {
      this.afs.collection('ticket').doc(id).update({
        date: ticket.date,
        source: ticket.source,
        site: ticket.site,
        module: ticket.module,
        creator: ticket.creator,
        type: ticket.type,
        subject: ticket.subject,
        priority: ticket.priority,
        description: ticket.description,
        resolveDescription: ticket.resolveDescription,
        status: ticket.status,
        staff: ticket.staff
      })
      this.successNotification();
    } catch (error) {
      this.errorNotification();
    }
  }

  setActionById(id: any, status: string, staff: any) {
    this.afs.collection('ticket').doc(id)
      .collection('action')
      .add({
        staff,
        status,
        date: new Date(),
      })
  }

  getByKeyWord(keword: any, role) {
    return this.afs.collection('ticket', (ref) => ref
      .orderBy('subject')
      .where('status', 'in', role)
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

  getCountByStatusCurrentname(status: string, creator: string) {
    return this.afs.collection('ticket', ref => ref
      .where('status', '==', status)
      .where('staff', '==', creator)
    ).valueChanges();
  }

  getTicketsList(role: any) {
    return this.afs.collection('ticket', ref => ref
      .where('status', 'in', role)
      .orderBy('date', 'desc')
    );
  }

  getTicketsListCurrentname(creator: string, role: any) {
    return this.afs.collection('ticket', ref => ref
      .where('status', 'in', role)
      .where('staff', '==', creator)
      .orderBy('date', 'desc')
    );
  }

  getByDaterange(startDate: any, endDate: any, role: any) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>', startDate)
      .where('date.singleDate.jsDate', '<', endDate)
      .where('status', 'in', role)
    );
  }

  getByCurrentnameStatusKewordDateRange(keword: any, creator: string, status: string, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>', startDate)
      .where('date.singleDate.jsDate', '<', endDate)
      .where('staff', '==', creator)
      .where('status', '==', status)
      .where('subject', '==', keword)
    );
  }

  getByCurrentnameStatusDateRange(creator: string, status: string, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>', startDate)
      .where('date.singleDate.jsDate', '<', endDate)
      .where('staff', '==', creator)
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

  getByCurrentnameKewordDateRange(keword: any, creator: string, startDate: Date, endDate: Date, role: any) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>', startDate)
      .where('date.singleDate.jsDate', '<', endDate)
      .where('status', 'in', role)
      .where('staff', '==', creator)
      .where('subject', '==', keword)
    );
  }

  getByCurrentnameDateRange(creator: string, startDate: Date, endDate: Date, role: any) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>', startDate)
      .where('date.singleDate.jsDate', '<', endDate)
      .where('status', 'in', role)
      .where('staff', '==', creator)
    );
  }

  getByKewordDaterange(keword: any, startDate: Date, endDate: Date, role: any) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>', startDate)
      .where('date.singleDate.jsDate', '<', endDate)
      .where('status', 'in', role)
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

  getTicketByCreatorStatus(creator: any, status: string) {
    return this.afs.collection('ticket', ref => ref
      .where('creator', '==', creator)
      .where('status', '==', status)
      .orderBy('date', 'desc')
    );
  }

  getCountByStatusCreatorStatus(status: string, creator: any) {
    return this.afs.collection('ticket', ref => ref
      .where('status', '==', status)
      .where('creator', '==', creator)
    ).valueChanges();
  }

  getTicketBySiteStatus(site: any, status: string) {
    return this.afs.collection('ticket', ref => ref
      .where('site.initials', '==', site)
      .where('status', '==', status)
      .orderBy('date', 'desc')
    )
  }

  getByKewordCreatorStatus(keword: any, creator: any, status: string) {
    return this.afs.collection('ticket', (ref) => ref
      .where('status', '==', status)
      .where('creator', '==', creator)
      .orderBy('subject')
      .startAt(keword)
      .endAt(keword + '\uf8ff')
    )
  }

  getByKewordSiteStatus(keword: any, site: any, status: string) {
    return this.afs.collection('ticket', ref => ref
      .where('status', '==', status)
      .where('site.initials', '==', site)
      .orderBy('subject')
      .startAt(keword)
      .endAt(keword + '\uf8ff')
    )
  }

  getByCreatorStatusKeword(creator: any, status: string, keword: any, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>', startDate)
      .where('date.singleDate.jsDate', '<', endDate)
      .where('creator', '==', creator)
      .where('status', '==', status)
      .where('subject', '==', keword)
    )
  }

  getByCreatorStatus(creator: any, status: string, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>', startDate)
      .where('date.singleDate.jsDate', '<', endDate)
      .where('creator', '==', creator)
      .where('status', '==', status)
    )
  }

  getBySiteStatusKeword(siteState: any, status: string, keword: any, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>', startDate)
      .where('date.singleDate.jsDate', '<', endDate)
      .where('site.initials', '==', siteState)
      .where('status', '==', status)
      .where('subject', '==', keword)
    )
  }

  getBySiteStatus(siteState: any, status: string, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>', startDate)
      .where('date.singleDate.jsDate', '<', endDate)
      .where('site.initials', '==', siteState)
      .where('status', '==', status)
    )
  }

  getTrack(id: string): any {
    return this.afs.collection('ticket').doc(id)
      .collection('action', ref => ref
        // .where('staff', '==', 'Support Test')
        .orderBy('date', 'desc'))
  }


}
