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
      });
      this.successNotification();
    } catch (error) {
      this.errorNotification();
    }
  }

  //TODO : Get by Value
  getByKeyWord(value: any) {
    this.afs.collection('ticket', (ref) => ref
      .where('site.initials', '==', value)
      .where('site.nameEN', '==', value)
      // .where('nameTH', '==', value)
      // .where('subject', '==', value)
    )
      .snapshotChanges().subscribe(data => {
        data.map(items => {
          const item = items.payload.doc.data();
          item['$uid'] = items.payload.doc.id;
          console.log(item);
        })
      });
  }


  //We define an async function
  // async getIsCapitalOrCountryIsItaly() {
  //   const isInitials = this.afs.collection('ticket', (ref) => ref.where('site.initials', '==', 'value')).get();
  //   const isNameEN = this.afs.collection('ticket', (ref) => ref.where('site.nameEN', '==', 'value')).get();

  //   const [initialslQuerySnapshot, nameENQuerySnapshot] = await Promise.all([
  //     isInitials,
  //     isNameEN
  //   ]);

  //   const initialsArray = initialslQuerySnapshot.docs;
  //   const nameENArray = nameENQuerySnapshot.docs

  //   const ticketsArray = initialsArray.concat(nameENArray);
  //   return ticketsArray;
  // }

  //We call the asychronous function
  // getIsCapitalOrCountryIsItaly().then(result => {
  //   result.forEach(docSnapshot => {
  //     console.log(docSnapshot.data());
  //   });
  // });

  //TODO : UPDATE

  //TODO : DELETE 
}
