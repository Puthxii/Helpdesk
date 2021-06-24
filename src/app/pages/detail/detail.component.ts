import { TicketService } from 'src/app/services/ticket/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth/auth.service';

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
  actions: Observable<any>
  dateThai: any
  constructor(
    public ticketService: TicketService,
    public route: ActivatedRoute,
    public auth: AuthService,
  ) {
    this.route.params.subscribe(params => this.id = params.id);
  }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user)
    this.ticket$ = this.ticketService.getTicketByid(this.id);
    this.actions = this.ticketService.getTrack(this.id).valueChanges();
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
    const maStartDate = moment(ticket.site.maStartDate.seconds * 1000).format('L');
    const maEndDate = moment(ticket.site.maEndDate.seconds * 1000).format('L');
    return maStartDate + ' - ' + maEndDate;
  }

  getSubject(ticket: Ticket) {
    return ticket.subject ? ticket.subject : false;
  }

  getDescription(ticket: Ticket) {
    return ticket.description ? ticket.description : false;
  }

  getDescriptionMA(ticket: Ticket) {
    return ticket.maDescription ? ticket.maDescription : false;
  }

  getResolvedDescription(ticket: Ticket) {
    return ticket.resolveDescription ? ticket.resolveDescription : false;
  }

  getResponseDescription(ticket: Ticket) {
    return ticket.responseDescription ? ticket.responseDescription : false;
  }

  getSuggestDescription(ticket: Ticket) {
    return ticket.suggestDescription ? ticket.suggestDescription : false;
  }

  setExpirationDate(ticket: Ticket) {
    let color = ''
    const endDate = new Date(ticket.site.maEndDate.seconds * 1000)
    const currentDate = new Date()
    if (endDate > currentDate) {
      color = 'curentDate'
    } else {
      color = 'expirationDate'
    }
    return color
  }

  getDev(action: { dev: string | any[]; }) {
    const name = []
    if (typeof action.dev === 'object') {
      for (let i = 0; action.dev.length > i; i++) {
        name.push(action.dev[i].fullName)
      }
    }
    return (name.length != 0) ? name : '-'
  }

  fileExit(file: any) {
    if (file) {
      return file.length ? true : false
    }
  }

}

