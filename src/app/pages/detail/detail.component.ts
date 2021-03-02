import { TicketService } from 'src/app/services/ticket/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { map, tap } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import { M } from 'angular-mydatepicker';


@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  ticket$: Observable<Ticket>;
  id: string;
  addTicketForm: any;
  user
  action: Observable<any>
  actions: Observable<any>
  dateThai: any
  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private afs: AngularFirestore
  ) {
    this.route.params.subscribe(params => this.id = params.id);
  }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user)
    this.ticket$ = this.ticketService.getTicketByid(this.id);
    this.action = this.ticketService.getTrack(this.id).snapshotChanges().subscribe(data => {
      data.map(items => {
        const item = items.payload.doc.data();
        const id = items.payload.doc.id;
        return { id, ...item };
      })
    })
    this.actions = this.afs.collection('ticket').doc(this.id).collection('action').valueChanges()
    // .pipe(map((date: any) => {
    //   return date.map((m: any) => ({
    //     ...m,
    //     dateThai: moment(new Date).format('MMMM Do YYYY, h:mm:ss a')}))
    // }))
  }

  getDate(ticket) {
    return ticket.date.singleDate.formatted ? ticket.date.singleDate.formatted : '-';
  }

  getSource(ticket) {
    return ticket.source ? ticket.source : '-';
  }

  getSitename(ticket) {
    return ticket.site.nameEN ? ticket.site.nameEN : '-';
  }

  getModule(ticket) {
    return ticket.module ? ticket.module : '-';
  }

  getProduct(ticket) {
    return ticket.site.product.name ? ticket.site.product.name : '-';
  }

  getMaPackage(ticket) {
    const maStartDate = moment(ticket.site.maStartDate).format('DD/MM/YYYY');
    const maEndDate = moment(ticket.site.maEndDate).format('DD/MM/YYYY');
    return maStartDate + ' - ' + maEndDate;
  }

  getSubject(ticket) {
    return ticket.subject ? ticket.subject : '-';
  }

  getdescription(ticket) {
    return ticket.description ? ticket.description : '-';
  }
}


