import { AngularFirestore } from '@angular/fire/firestore';
import { Actions, Tasks, Ticket } from '../../models/ticket.model';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
import { IMyDateModel } from 'angular-mydatepicker';

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

  getTicketsListByStatusFilter(status: string) {
    return this.afs.collection('ticket', ref => ref
      .where('status', '==', status)
    )
  }

  getTicketsListByRole(role: string[]) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('status', 'in', role)
    );
  }

  getTicketsListByUserIdRole(userId: string, role: string[]) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('status', 'in', role)
      .where(`participantIds.${userId}`, '==', true)
    );
  }

  getTicketsListByUserIdStatus(userId: string, status: string) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where(`participantIds.${userId}`, '==', true)
      .where('status', '==', status)
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

  updateMoreInfo(id: string, value: boolean) {
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
      const keyword = await this.generateKeyword(
        ticket.subject,
        countIncrement,
        ticket.creatorName,
        ticket.site.initials,
        ticket.site.nameEN,
        ticket.site.nameTH)
      await (await this.afs.collection('ticket').add({
        date: ticket.date,
        source: ticket.source,
        site: ticket.site,
        module: ticket.module,
        creator: ticket.creator,
        creatorName: ticket.creatorName,
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
    let count: number
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
      const keyword = await this.generateKeyword(
        ticket.subject,
        ticket.countIncrement,
        ticket.creatorName,
        ticket.site.initials,
        ticket.site.nameEN,
        ticket.site.nameTH)
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
        minDueDate: ticket.minDueDate,
        keyword
      })
      await this.upDateParticipantIds(id, ticket.userId, true)
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

  async editSuggestDescription(ticket: Ticket, id: any) {
    try {
      await this.afs.collection('ticket').doc(id).update({
        suggestDescription: ticket.suggestDescription,
      })
    } catch (error) {
      console.log(error);
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
        .where(`participantIds.${userId}`, '==', true)
    }
    )
  }

  getByKeywordUserIdStatusSpacial(keyword: string, userId: string, status: any) {
    return this.afs.collection<Ticket>('ticket', (ref) => {
      return ref
        .where('status', 'in', status)
        .where('keyword', 'array-contains', keyword)
        .where(`participantIds.${userId}`, '==', true)
    }
    )
  }

  getByKeywordUserIdRole(keyword: string, userId: string, role: string[]) {
    return this.afs.collection<Ticket>('ticket', (ref) => ref
      .where('keyword', 'array-contains', keyword)
      .where('status', 'in', role)
      .where(`participantIds.${userId}`, '==', true))
  }

  getByKeywordRole(keyword: string, role: string[]) {
    return this.afs.collection<Ticket>('ticket', (ref) => ref
      .where('status', 'in', role)
      .where('keyword', 'array-contains', keyword));
  }

  getTicketById(id: any) {
    return this.afs.doc<Ticket>(`ticket/` + id).valueChanges();
  }

  getCountByStatus(status: any) {
    return this.afs.collection('ticket', ref => ref.where('status', '==', status)).valueChanges();
  }

  getCountByStatusSite(status: any, site: any) {
    return this.afs.collection('ticket', ref => ref.where('status', '==', status).where('site.initials', '==', site)
    ).valueChanges();
  }

  getCountByUserIdStatus(userId: string, status: string) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('status', '==', status)
      .where(`participantIds.${userId}`, '==', true)
    ).valueChanges();
  }

  getByDateRangeKeywordUserIdStatus(startDate: Date, endDate: Date, keyword: any, userId: string, status: string) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where(`participantIds.${userId}`, '==', true)
      .where('status', '==', status)
      .where('keyword', 'array-contains', keyword)
    );
  }

  getByDateRangeUserIdStatus(startDate: Date, endDate: Date, userId: string, status: string) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where(`participantIds.${userId}`, '==', true)
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

  getByDateRangeKeywordUserIdRole(startDate: Date, endDate: Date, keyword: string, userId: string, role: string[]) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('keyword', 'array-contains', keyword)
      .where(`participantIds.${userId}`, '==', true)
      .where('status', 'in', role)
    );
  }

  getByDateRangeUserIdRole(startDate: Date, endDate: Date, userId: string, role: string[]) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where(`participantIds.${userId}`, '==', true)
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

  getTicketByCreatorSpecialStatus(creator: string, status: string[]) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('creator', '==', creator)
      .where('status', 'in', status)
    );
  }

  getTicketByCreatorStatus(creator: string, status: string) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('creator', '==', creator)
      .where('status', '==', status)
    );
  }

  getCountByStatusCreatorStatus(status: string, creator: string) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('status', '==', status)
      .where('creator', '==', creator)
    ).valueChanges();
  }

  getTicketBySiteSpecialStatus(site: string, status: string[]) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('site.initials', '==', site)
      .where('status', 'in', status)
    )
  }

  getTicketBySiteStatus(site: string, status: string) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('site.initials', '==', site)
      .where('status', '==', status)
    )
  }

  getByKeywordCreatorStatus(keyword: string, creator: string, status: string) {
    return this.afs.collection<Ticket>('ticket', (ref) => ref
      .where('status', '==', status)
      .where('creator', '==', creator)
      .where('keyword', 'array-contains', keyword)
    );
  }

  getByKeywordSiteStatus(keyword: string, site: string, status: string) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('status', '==', status)
      .where('site.initials', '==', site)
      .where('keyword', 'array-contains', keyword)
    )
  }

  getByCreatorStatusKeyword(creator: string, status: string, keyword: string, startDate: Date, endDate: Date) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('creator', '==', creator)
      .where('status', '==', status)
      .where('keyword', 'array-contains', keyword)
    )
  }

  getByCreatorStatus(creator: string, status: string, startDate: Date, endDate: Date) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('creator', '==', creator)
      .where('status', '==', status)
    )
  }

  getBySiteStatusKeyword(siteState: string, status: string, keyword: string, startDate: Date, endDate: Date) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('site.initials', '==', siteState)
      .where('status', '==', status)
      .where('keyword', 'array-contains', keyword)
    )
  }

  getBySiteStateStatus(siteState: string, status: string, startDate: Date, endDate: Date) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', startDate)
      .where('date.singleDate.jsDate', '<=', endDate)
      .where('site.initials', '==', siteState)
      .where('status', '==', status)
    )
  }

  getTrack(id: string) {
    return this.afs.collection('ticket').doc(id)
      .collection('action', ref => ref
        .orderBy('date', 'asc'))
  }

  getTask(id: string) {
    return this.afs.collection('ticket').doc(id)
      .collection('tasks')
  }

  private async generateKeyword(subject: string, countIncrement: number, creator: string, initials: string, EN: string, TH: string) {
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
    const keywordCreator = await creatKeywords(`${creator}`)
    const keywordCreatorLowerCase = await creatKeywords(`${creator.toLowerCase()}`)
    const keywordCreatorUpperCase = await creatKeywords(`${creator.toUpperCase()}`)
    const keywordInitials = await creatKeywords(`${initials}`)
    const keywordInitialsLowerCase = await creatKeywords(`${initials.toLowerCase()}`)
    const keywordInitialsUpperCase = await creatKeywords(`${initials.toUpperCase()}`)
    const keywordEN = await creatKeywords(`${EN}`)
    const keywordENLowerCase = await creatKeywords(`${EN.toLowerCase()}`)
    const keywordENUpperCase = await creatKeywords(`${EN.toUpperCase()}`)
    const keywordTH = await creatKeywords(`${TH}`)
    return [
      '',
      ...keywordSubject,
      ...keywordCountIncrement,
      ...keywordLowerCase,
      ...keywordUpperCase,
      ...keywordCreator,
      ...keywordCreatorLowerCase,
      ...keywordCreatorUpperCase,
      ...keywordInitials,
      ...keywordInitialsLowerCase,
      ...keywordInitialsUpperCase,
      ...keywordEN,
      ...keywordENLowerCase,
      ...keywordENUpperCase,
      ...keywordTH
    ]
  }

  async upDateParticipantIds(id: string, userId: string, active: boolean) {
    await this.afs.collection('ticket').doc(id).set({
      "participantIds": {
        [userId]: active
      }
    }, { merge: true })
  }

  getBySiteDateRangeKeywordUserIdStatus(site: string, keyword: string, userId: string, status: string, dateRange: IMyDateModel) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', dateRange.dateRange.beginJsDate)
      .where('date.singleDate.jsDate', '<=', dateRange.dateRange.endJsDate)
      .where('status', '==', status)
      .where('site.initials', '==', site)
      .where('keyword', 'array-contains', keyword)
    )
  }

  getBySiteDateRangeUserIdStatus(site: string, userId: string, status: string, dateRange: IMyDateModel) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', dateRange.dateRange.beginJsDate)
      .where('date.singleDate.jsDate', '<=', dateRange.dateRange.endJsDate)
      .where('status', '==', status)
      .where('site.initials', '==', site)
      .where(`participantIds.${userId}`, '==', true)
    )
  }

  getBySiteDateRangeKeywordStatus(site: string, keyword: string, status: string, dateRange: IMyDateModel) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', dateRange.dateRange.beginJsDate)
      .where('date.singleDate.jsDate', '<=', dateRange.dateRange.endJsDate)
      .where('status', '==', status)
      .where('site.initials', '==', site)
      .where('keyword', 'array-contains', keyword)
    )
  }

  getBySiteDateRangeStatus(site: string, status: string, dateRange: IMyDateModel) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', dateRange.dateRange.beginJsDate)
      .where('date.singleDate.jsDate', '<=', dateRange.dateRange.endJsDate)
      .where('status', '==', status)
      .where('site.initials', '==', site)
    )
  }

  getBySiteDateRangeKeywordUserIdRole(site: string, keyword: string, userId: string, History: string[], dateRange: IMyDateModel) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', dateRange.dateRange.beginJsDate)
      .where('date.singleDate.jsDate', '<=', dateRange.dateRange.endJsDate)
      .where('status', 'in', History)
      .where('site.initials', '==', site)
      .where('keyword', 'array-contains', keyword)
      .where(`participantIds.${userId}`, '==', true)
    )
  }

  getBySiteDateRangeUserIdRole(site: string, userId: string, History: string[], dateRange: IMyDateModel) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', dateRange.dateRange.beginJsDate)
      .where('date.singleDate.jsDate', '<=', dateRange.dateRange.endJsDate)
      .where('status', 'in', History)
      .where('site.initials', '==', site)
      .where(`participantIds.${userId}`, '==', true)
    )
  }

  getBySiteDateRangeKeywordRole(site: string, keyword: string, History: string[], dateRange: IMyDateModel) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', dateRange.dateRange.beginJsDate)
      .where('date.singleDate.jsDate', '<=', dateRange.dateRange.endJsDate)
      .where('status', 'in', History)
      .where('site.initials', '==', site)
      .where('keyword', 'array-contains', keyword)
    )
  }

  getBySiteDateRangeRole(site: string, History: string[], dateRange: IMyDateModel) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('date.singleDate.jsDate', '>=', dateRange.dateRange.beginJsDate)
      .where('date.singleDate.jsDate', '<=', dateRange.dateRange.endJsDate)
      .where('status', 'in', History)
      .where('site.initials', '==', site)
    )
  }

  getBySiteKeywordUserIdStatus(site: string, keyword: string, userId: string, status: string) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('site.initials', '==', site)
      .where('keyword', 'array-contains', keyword)
      .where(`participantIds.${userId}`, '==', true)
      .where('status', '==', status)
    )
  }

  getBySiteUserIdStatus(site: string, userId: string, status: string) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('site.initials', '==', site)
      .where(`participantIds.${userId}`, '==', true)
      .where('status', '==', status)
    )
  }

  getBySiteKeywordStatus(site: string, keyword: string, status: string) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('site.initials', '==', site)
      .where('keyword', 'array-contains', keyword)
      .where('status', '==', status)
    )
  }

  getBySiteStatus(site: string, status: string) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('site.initials', '==', site)
      .where('status', '==', status)
    )
  }

  getBySiteKeywordUserIdRole(site: string, keyword: string, userId: string, History: string[]) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('site.initials', '==', site)
      .where('keyword', 'array-contains', keyword)
      .where(`participantIds.${userId}`, '==', true)
      .where('status', 'in', History)
    )
  }

  getBySiteUserIdRole(site: string, userId: string, History: string[]) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('site.initials', '==', site)
      .where(`participantIds.${userId}`, '==', true)
      .where('status', 'in', History)
    )
  }

  getBySiteKeywordRole(site: string, keyword: string, History: string[]) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('site.initials', '==', site)
      .where('keyword', 'array-contains', keyword)
      .where('status', 'in', History)
    )
  }

  getBySiteRole(site: string, History: string[]) {
    return this.afs.collection<Ticket>('ticket', ref => ref
      .where('site.initials', '==', site)
      .where('status', 'in', History)
    )
  }

}
