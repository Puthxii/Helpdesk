import { AngularFirestore } from '@angular/fire/firestore';
import { Ticket, Actions, Tasks } from '../../models/ticket.model';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
import { Roles } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor(
    private afs: AngularFirestore,
    private router: Router,
  ) { }

  successNotification(role: Roles) {
    Swal.fire({
      text: 'Your ticket has been saved',
      icon: 'success',
    }).then((result: any) => {
      if (role.customer === true) {
        this.router.navigate(['/site-ticket']);
      } else if (role.supporter === true) {
        this.router.navigate(['/ticket']);
      } else if (role.maintenance === true) {
        this.router.navigate(['/ticket-ma']);
      } else if (role.supervisor === true) {
        this.router.navigate(['/ticket-sup']);
      } else if (role.developer === true) {
        this.router.navigate(['/ticket-dev']);
      }
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

  getTicketsListByStatusFilter(status: any) {
    return this.afs.collection('ticket', ref => ref
      .where('status', '==', status)
      .orderBy('date', 'desc')
    )
  }

  getTicketsListByStatusSpecialFilter(status: any) {
    return this.afs.collection('ticket', ref => ref
      .where('status', 'in', status)
      .orderBy('date', 'desc')
    )
  }

  getTicketsListByCreatorSpecialStatus(status: any, creator: string) {
    return this.afs.collection('ticket', ref => ref
      .where('status', 'in', status)
      .where('participant', 'array-contains', creator)
      .orderBy('date', 'desc')
    )
  }

  getTicketsListByFilter(status: any, creator: string) {
    return this.afs.collection('ticket', ref => ref
      .where('participant', 'array-contains', creator)
      .where('status', '==', status)
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

  async addTicket(ticket: Ticket, role) {
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
        descriptionFile: ticket.descriptionFile,
        responseDescription: ticket.responseDescription,
        responseDescriptionFile: ticket.responseDescriptionFile,
        status: ticket.status,
        staff: ticket.staff,
        email: ticket.email,
        participant: ticket.participant,
      }))
        .collection('action')
        .add({
          staff: ticket.staff,
          status: ticket.status,
          date: new Date(),
          actionSentence: ticket.actionSentence
        });
      this.deleteCollection('uploadDesciption')
      this.deleteCollection('uploadResolveDescription')
      this.successNotification(role);
    } catch (error) {
      console.log(error);
      this.errorNotification();
    }
  }

  async deleteCollection(path: string) {
    const batch = this.afs.firestore.batch();
    const qs = await this.afs.collection(path).ref.get();
    qs.forEach((doc: { ref: any; }) => batch.delete(doc.ref));
    return batch.commit();
  }

  async editTicket(ticket: Ticket, id: any, role: Roles) {
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
        responseDescription: ticket.responseDescription,
        responseDescriptionFile: ticket.responseDescriptionFile,
        status: ticket.status,
        staff: ticket.staff,
        descriptionFile: ticket.descriptionFile,
        participant: ticket.participant,
        maDescription: ticket.maDescription,
        maDescriptionFile: ticket.maDescriptionFile,
        suggestDescription: ticket.suggestDescription,
        suggestDescriptionFile: ticket.suggestDescriptionFile,
        resolveDescription: ticket.resolveDescription,
        resolveDescriptionFile: ticket.resolveDescriptionFile
      })
      this.deleteCollection('uploadDesciption')
      this.deleteCollection('uploadResponseDescription')
      this.deleteCollection('uploadMaDescription')
      this.deleteCollection('uploadSuggestDescription')
      this.deleteCollection('uploadResolveDescription')
      this.successNotification(role);
    } catch (error) {
      this.errorNotification();
    }
  }

  setActionById(id: any, actions: Actions) {
    this.afs.collection('ticket').doc(id)
      .collection('action')
      .add({
        actionSentence: actions.actionSentence,
        dev: actions.dev,
        staff: actions.staff,
        status: actions.status,
        date: new Date(),
      })
  }

  setAddTasks(id: any, tasks: Tasks) {
    this.afs.collection('ticket').doc(id)
      .collection('tasks')
      .add({
        subjectTask: tasks.subjectTask,
        developer: tasks.developer,
        point: tasks.point,
        dueDate: tasks.dueDate
      })
  }

  updateTasks(id: any, tasks: Tasks) {
    this.afs.collection('ticket').doc(id)
      .collection('tasks', ref => ref
        .doc(tasks.id)
        .update({
          subjectTask: tasks.subjectTask,
          developer: tasks.developer,
          point: tasks.point,
          dueDate: tasks.dueDate
        }))
  }

  removeTasks(id: any, tasks: Tasks) {
    this.afs.collection('ticket').doc(id).collection('tasks').doc(tasks.id).delete();
  }

  getByKeyWord(keword: any, role) {
    return this.afs.collection('ticket', (ref) => ref
      .orderBy('subject')
      .where('status', 'in', role)
      .startAt(keword)
      .endAt(keword + '\uf8ff'));
  }

  getByStatus(keword: string, status: any) {
    return this.afs.collection('ticket', (ref) => ref
      .where('status', '==', status)
      .orderBy('subject')
      .startAt(keword)
      .endAt(keword + '\uf8ff'));
  }

  getByCurrentnameStatus(keword: string, currentName: string, status: any) {
    return this.afs.collection('ticket', (ref) => ref
      .where('status', '==', status)
      .where('participant', 'array-contains', currentName)
      .orderBy('subject')
      .startAt(keword)
      .endAt(keword + '\uf8ff'));
  }

  getByCurrentname(keword: string, currentName: string) {
    return this.afs.collection('ticket', (ref) => ref
      .where('participant', 'array-contains', currentName)
      .orderBy('subject')
      .startAt(keword)
      .endAt(keword + '\uf8ff'));
  }

  getTicketByid(id: any) {
    return this.afs.doc<Ticket>(`ticket/` + id).valueChanges();
  }

  getCountByStatus(status: any) {
    return this.afs.collection('ticket', ref => ref.where('status', '==', status)).valueChanges();
  }

  getCountByStatusCurrentname(status: any, creator: string) {
    return this.afs.collection('ticket', ref => ref
      .where('status', '==', status)
      .where('participant', 'array-contains', creator)
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
      .where('participant', 'array-contains', creator)
      .orderBy('date', 'desc')
    );
  }

  getByDaterange(startDate: any, endDate: any, role: any) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('status', 'in', role)
    );
  }

  getByCurrentnameStatusKewordDateRange(keword: any, creator: string, status: any, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('participant', 'array-contains', creator)
      .where('status', '==', status)
      .where('subject', '==', keword)
    );
  }

  getByCurrentnameStatusDateRange(creator: string, status: any, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('participant', 'array-contains', creator)
      .where('status', '==', status)
    );
  }

  getByStatusKewordDateRange(keword: any, status: any, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('status', '==', status)
      .where('subject', '==', keword)
    );
  }

  getByCurrentnameKewordDateRange(keword: any, creator: string, startDate: Date, endDate: Date, role: any) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('status', 'in', role)
      .where('participant', 'array-contains', creator)
      .where('subject', '==', keword)
    );
  }

  getByCurrentnameDateRange(creator: string, startDate: Date, endDate: Date, role: any) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('status', 'in', role)
      .where('participant', 'array-contains', creator)
    );
  }

  getByKewordDaterange(keword: any, startDate: Date, endDate: Date, role: any) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('status', 'in', role)
      .where('subject', '==', keword)
    );
  }

  getByStatusDateRange(status: any, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('status', '==', status)
    );
  }

  getTicketByCreatorSpecialStatus(creator: any, status: any) {
    return this.afs.collection('ticket', ref => ref
      .where('creator', '==', creator)
      .where('status', 'in', status)
      .orderBy('date', 'desc')
    );
  }

  // todo : customer get ticket by status
  getTicketByCreatorStatus(creator: any, status: any) {
    return this.afs.collection('ticket', ref => ref
      .where('creator', '==', creator)
      .where('status', '==', status)
      .orderBy('date', 'desc')
    );
  }

  getCountByStatusCreatorStatus(status: any, creator: any) {
    return this.afs.collection('ticket', ref => ref
      .where('status', '==', status)
      .where('creator', '==', creator)
    ).valueChanges();
  }

  getTicketBySiteSpecialStatus(site: any, status: any) {
    return this.afs.collection('ticket', ref => ref
      .where('site.initials', '==', site)
      .where('status', 'in', status)
      .orderBy('date', 'desc')
    )
  }

  getTicketBySiteStatus(site: any, status: any) {
    return this.afs.collection('ticket', ref => ref
      .where('site.initials', '==', site)
      .where('status', '==', status)
      .orderBy('date', 'desc')
    )
  }

  getByKewordCreatorStatus(keword: any, creator: any, status: any) {
    return this.afs.collection('ticket', (ref) => ref
      .where('status', '==', status)
      .where('creator', '==', creator)
      .orderBy('subject')
      .startAt(keword)
      .endAt(keword + '\uf8ff')
    )
  }

  getByKewordSiteStatus(keword: any, site: any, status: any) {
    return this.afs.collection('ticket', ref => ref
      .where('status', '==', status)
      .where('site.initials', '==', site)
      .orderBy('subject')
      .startAt(keword)
      .endAt(keword + '\uf8ff')
    )
  }

  getByCreatorStatusKeword(creator: any, status: any, keword: any, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('creator', '==', creator)
      .where('status', '==', status)
      .where('subject', '==', keword)
    )
  }

  getByCreatorStatus(creator: any, status: any, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('creator', '==', creator)
      .where('status', '==', status)
    )
  }

  getBySiteStatusKeword(siteState: any, status: any, keword: any, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('site.initials', '==', siteState)
      .where('status', '==', status)
      .where('subject', '==', keword)
    )
  }

  getBySiteStatus(siteState: any, status: any, startDate: Date, endDate: Date) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('site.initials', '==', siteState)
      .where('status', '==', status)
    )
  }

  getTrack(id: string): any {
    return this.afs.collection('ticket').doc(id)
      .collection('action', ref => ref
        .orderBy('date', 'asc'))
  }

  getTask(id: string): any {
    return this.afs.collection('ticket').doc(id)
      .collection('tasks')
  }
}
