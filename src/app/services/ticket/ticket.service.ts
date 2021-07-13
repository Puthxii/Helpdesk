import {AngularFirestore} from '@angular/fire/firestore';
import {Actions, Tasks, Ticket} from '../../models/ticket.model';
import {Injectable} from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor(
    private afs: AngularFirestore,
    private router: Router,
  ) { }

  successNotification(path: string) {
    Swal.fire({
      text: 'Your ticket has been saved',
      icon: 'success',
    }).then((result: any) => {
        this.router.navigate([`/${path}`]);
    });
  }

  errorNotification(path: string) {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Your ticket hasn\'t been saved',
    }).then((result: any) => {
      this.router.navigate([`/${path}`]);
    });
  }

  errorCancel() {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Your ticket hasn\'t  been deleted',
    })
  }

  successCancel() {
    Swal.fire({
      icon: 'success',
      title: 'deleted',
      text: 'Your ticket has been deleted',
    })
  }

  getTicketsListByStatusFilter(status: any) {
    return this.afs.collection('ticket', ref => ref
      .where('status', '==', status)
      .orderBy('date.singleDate.jsDate', 'asc')
    )
  }

  getTicketsListByStatusSpecialFilter(status: any) {
    return this.afs.collection('ticket', ref => ref
      .where('status', 'in', status)
      .orderBy('date.singleDate.jsDate', 'asc')
    )
  }

  getTicketsListByCreatorSpecialStatus(status: any, creator: string) {
    return this.afs.collection('ticket', ref => ref
      .where('status', 'in', status)
      .where('participant', 'array-contains', creator)
      .orderBy('date.singleDate.jsDate', 'asc')
    )
  }

  getTicketsListByFilter(status: any, creator: string) {
    return this.afs.collection('ticket', ref => ref
      .where('participant', 'array-contains', creator)
      .where('status', '==', status)
      .orderBy('date.singleDate.jsDate', 'asc')
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
          this.updateStatusToCancel(id)
        }
      })
    } catch (error) {
      this.errorCancel();
    }
  }

  updateStatusToCancel(id: string) {
    try {
      this.afs.collection('ticket').doc(id).update({
        status: 'Cancel'
      })
      this.successCancel()
    } catch (error) {
      this.errorCancel();
    }
  }

  updateMoreInfo(id: string, value: boolean){
    try {
      this.afs.collection('ticket').doc(id).update({
        moreInfo: value
      })
    } catch (error) {
      console.log(error)
    }
  }

  async addTicket(ticket: Ticket, path: string) {
    try {
      const countIncrement = await this.getCount()
      const keyword = await this.generateKeyword(ticket.subject, countIncrement)
      await (await this.afs.collection('ticket').add({
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
        participantId: ticket.participantId,
        countIncrement,
        keyword,
        participantIds: {
          [ticket.userId]: true
        }
      }))
        .collection('action')
        .add({
          staff: ticket.staff,
          status: ticket.status,
          date: new Date(),
          actionSentence: ticket.actionSentence
        });
      await this.deleteCollection('uploadDescription')
      await this.deleteCollection('uploadResolveDescription')
      this.successNotification(path);
    } catch (error) {
      console.log(error);
      this.errorNotification(path);
    }
  }

  async getCount(): Promise<number> {
    let count : number
    const query = await this.afs.collection('ticket');
    const snapshot = await query.get();
    await snapshot.forEach((snapshot) =>
       count = snapshot.docs.length + 1
    )
    return count
  }

  async deleteCollection(path: string) {
    const batch = this.afs.firestore.batch();
    const qs = await this.afs.collection(path).ref.get();
    qs.forEach((doc: { ref: any; }) => batch.delete(doc.ref));
    return batch.commit();
  }

  async editTicket(ticket: Ticket, id: any, path: string) {
    try {
      await this.afs.collection('ticket').doc(id).update({
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
        participantId: ticket.participantId,
        maDescription: ticket.maDescription,
        maDescriptionFile: ticket.maDescriptionFile,
        suggestDescription: ticket.suggestDescription,
        suggestDescriptionFile: ticket.suggestDescriptionFile,
        resolveDescription: ticket.resolveDescription,
        resolveDescriptionFile: ticket.resolveDescriptionFile,
        sumPoint: ticket.sumPoint,
        maxDueDate: ticket.maxDueDate,
        minDueDate: ticket.minDueDate
      })
      await this.upDateParticipantIds(id, ticket.userId,true)
      await this.deleteCollection('uploadDescription')
      await this.deleteCollection('uploadResponseDescription')
      await this.deleteCollection('uploadMaDescription')
      await this.deleteCollection('uploadSuggestDescription')
      await this.deleteCollection('uploadResolveDescription')
      await this.successNotification(path);
    } catch (error) {
      this.errorNotification(path);
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
        dueDate: tasks.dueDate,
        checked: tasks.checked
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
          dueDate: tasks.dueDate,
          checked: tasks.checked
        }))
  }

  removeTasks(id: any, tasks: Tasks) {
    this.afs.collection('ticket').doc(id).collection('tasks').doc(tasks.id).delete();
  }

  getByKeywordStatus(keyword: string, status: any) {
    return this.afs.collection<Ticket>('ticket', (ref) => ref
      .where('status', '==', status)
      .where('keyword', 'array-contains', keyword));
  }

  getByKeywordStatusSpacial(keyword: string, status: any) {
    return this.afs.collection<Ticket>('ticket', (ref) => ref
      .where('status', 'in', status)
      .where('keyword', 'array-contains', keyword));
  }

  getByKeywordUserIdStatus(keyword: string, userId: string, status: any) {
    return this.afs.collection<Ticket>('ticket', (ref) => {
        return ref
          .where('status', '==', status)
          .where('keyword', 'array-contains', keyword)
          .where(`participantIds.${userId}` ,'==' ,true)
      }
    )
  }

  getByKeywordUserIdStatusSpacial(keyword: string, userId: string, status: any) {
    return this.afs.collection<Ticket>('ticket', (ref) => {
        return ref
          .where('status', 'in', status)
          .where('keyword', 'array-contains', keyword)
          .where(`participantIds.${userId}` ,'==' ,true)
      }
    )
  }

  getByKeywordUserIdRole(keyword: string, userId: string, role: string[]) {
    return this.afs.collection<Ticket>('ticket', (ref) => ref
      .where('keyword', 'array-contains', keyword)
      .where('status', 'in', role)
      .where(`participantIds.${userId}` ,'==' ,true))
  }

  getByKeywordRole(keyword: string, role) {
    return this.afs.collection<Ticket>('ticket', (ref) => ref
      .where('status', 'in', role)
      .where('keyword', 'array-contains', keyword));
  }

  getTicketByid(id: any) {
    return this.afs.doc<Ticket>(`ticket/` + id).valueChanges();
  }

  getCountByStatus(status: any) {
    return this.afs.collection('ticket', ref => ref.where('status', '==', status)).valueChanges();
  }

  getCountByStatusSite(status: any, site: any) {
    return this.afs.collection('ticket', ref => ref.where('status', '==', status).where('site.initials', '==', site)
    ).valueChanges();
  }

  getCountByStatusCurrentname(status: any, creator: string) {
    return this.afs.collection('ticket', ref => ref
      .where('status', '==', status)
      .where('participant', 'array-contains', creator)
      .orderBy('date.singleDate.jsDate', 'asc')
    ).valueChanges();
  }

  getTicketsList(role: any) {
    return this.afs.collection('ticket', ref => ref
      .where('status', 'in', role)
      .orderBy('date.singleDate.jsDate', 'asc')
    );
  }

  getTicketsListCurrentname(creator: string, role: any) {
    return this.afs.collection('ticket', ref => ref
      .where('status', 'in', role)
      .where('participant', 'array-contains', creator)
      .orderBy('date.singleDate.jsDate', 'asc')
    );
  }

  getByDateRangeKeywordUserIdStatus(startDate: Date, endDate: Date, keyword: any, userId: string, status: string) {
     return this.afs.collection<Ticket>('ticket', ref => ref
       .where('date.singleDate.jsDate', '>=', startDate)
       .where('date.singleDate.jsDate', '<=', endDate)
       .where(`participantIds.${userId}` ,'==' ,true)
       .where('status', '==', status)
       .where('keyword', 'array-contains', keyword)
     );
  }

  getByDateRangeUserIdStatus(startDate: Date, endDate: Date, userId: string, status: string) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where(`participantIds.${userId}` ,'==' ,true)
      .where('status', '==', status)
    );
  }

  getByDateRangeKeywordStatus(startDate: Date, endDate: Date, keyword: string, status: string) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('keyword', 'array-contains', keyword)
      .where('status', '==', status)
    );
  }

  getByDateRangeStatus(startDate: Date, endDate: Date, status: string) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('status', '==', status)
    );
  }

  getByDateRangeKeywordUserIdRole(startDate: Date, endDate: Date, keyword: string, userId: string,  role: string[]) {
    return this.afs.collection('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('keyword', 'array-contains', keyword)
      .where(`participantIds.${userId}` ,'==' ,true)
      .where('status', 'in', role)
    );
  }

  getByDateRangeUserIdRole(startDate: Date, endDate: Date, userId: string, role: string[]) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where(`participantIds.${userId}` ,'==' ,true)
      .where('status', 'in', role)
    );
  }

  getByDateRangeKeywordRole(startDate: Date, endDate: Date, keyword: string, role: string[]) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('keyword', 'array-contains', keyword)
      .where('status', 'in', role)
    );
  }

  getByDateRangeRole(startDate: Date, endDate: Date, role: string[]) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('status', 'in', role)
    );
  }

  //todo // customer get ticket by name
  getTicketByCreatorSpecialStatus(creator: any, status: string[]) {
    return this.afs.collection('ticket', ref => ref
      .where('creator', '==', creator)
      .where('status', 'in', status)
      .orderBy('date.singleDate.jsDate', 'asc')
    );
  }

  // todo : customer get ticket by status
  getTicketByCreatorStatus(creator: any, status: string) {
    return this.afs.collection('ticket', ref => ref
      .where('creator', '==', creator)
      .where('status', '==', status)
      .orderBy('date.singleDate.jsDate', 'asc')
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
      .orderBy('date.singleDate.jsDate', 'asc')
    )
  }

  getTicketBySiteStatus(site: any, status: any) {
    return this.afs.collection('ticket', ref => ref
      .where('site.initials', '==', site)
      .where('status', '==', status)
      .orderBy('date.singleDate.jsDate', 'asc')
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

  private async generateKeyword(subject: string, countIncrement: number) {
    function creatKeywords(str: string) {
      const arrName = []
      let curOrder = ''
      let curName2 = ''
      let curName3 = ''
      let curName4 = ''
      let curName5 = ''
      let curName6 = ''
      let curName7 = ''
      const chars = str.split('');
      for (let i = 0; i < chars.length; i++) {
        curOrder += chars[i]
        if (chars[i + 1] != undefined) {
          curName2 += chars[i]
          curName2 += chars[i + 1]
        }
        if (chars[i + 1] && chars[i + 2] != undefined) {
          curName3 += chars[i]
          curName3 += chars[i + 1]
          curName3 += chars[i + 2]
        }
        if (chars[i + 1] && chars[i + 2] && chars[i + 3] != undefined) {
          curName4 += chars[i]
          curName4 += chars[i + 1]
          curName4 += chars[i + 2]
          curName4 += chars[i + 3]
        }
        if (chars[i + 1] && chars[i + 2] && chars[i + 3] && chars[i + 4] != undefined) {
          curName5 += chars[i]
          curName5 += chars[i + 1]
          curName5 += chars[i + 2]
          curName5 += chars[i + 3]
          curName5 += chars[i + 4]
        }
        if (chars[i + 1] && chars[i + 2] && chars[i + 3] && chars[i + 4] && chars[i + 5] != undefined) {
          curName6 += chars[i]
          curName6 += chars[i + 1]
          curName6 += chars[i + 2]
          curName6 += chars[i + 3]
          curName6 += chars[i + 4]
          curName6 += chars[i + 5]
        }
        if (chars[i + 1] && chars[i + 2] && chars[i + 3] && chars[i + 4] && chars[i + 5] && chars[i + 6] != undefined) {
          curName7 += chars[i]
          curName7 += chars[i + 1]
          curName7 += chars[i + 2]
          curName7 += chars[i + 3]
          curName7 += chars[i + 4]
          curName7 += chars[i + 5]
          curName7 += chars[i + 6]
        }
        arrName.push(curOrder, chars[i], curName2, curName3, curName4, curName5, curName6, curName7)
        curName2 = ''
        curName3 = ''
        curName4 = ''
        curName5 = ''
        curName6 = ''
        curName7 = ''
      }
      return arrName
    }
    const keywordSubject = await creatKeywords(`${subject}`)
    const keywordCountIncrement = await creatKeywords(`${countIncrement}`)
    const keywordLowerCase = await creatKeywords(`${subject.toLowerCase()}`)
    const keywordUpperCase = await creatKeywords(`${subject.toUpperCase()}`)
    return [
        '',
        ...keywordSubject,
        ...keywordCountIncrement,
        ...keywordLowerCase,
        ...keywordUpperCase
    ]
  }

  private async upDateParticipantIds(id: any, userId: any, active: boolean) {
    await this.afs.collection('ticket').doc(id).set({
      "participantIds": {
        [userId]: active
      }
    }, {merge: true})
  }
}
