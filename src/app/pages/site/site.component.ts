import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site/site.service';
import { Site } from 'src/app/models/site.model';
import * as moment from 'moment';

@Component({
  selector: 'site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {
  p = 1;
  Site: Site[];
  hideWhenNoStaff = false;
  noData = false;
  preLoader = true;
  searchValue = '';

  constructor(
    private site: SiteService
  ) { }

  ngOnInit() {
    this.dataState();
    this.site.getSites().snapshotChanges().subscribe(data => {
      this.Site = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$key'] = items.payload.doc['id'];
        this.Site.push(item as Site)
      })
    });
  }

  dataState() {
    this.site.getSites().snapshotChanges().subscribe(data => {
      this.preLoader = false;
      if (data.length <= 0) {
        this.hideWhenNoStaff = false;
        this.noData = true;
      } else {
        this.hideWhenNoStaff = true;
        this.noData = false;
      }
    });
  }

  search() {
    const searchValue = this.searchValue
    if (searchValue != null) {
      this.getSitesByNameSort(searchValue)
    }
  }

  getSitesByNameSort(searchValue: any) {
    this.site.getSitesByNameSort(searchValue).snapshotChanges().subscribe(data => {
      this.Site = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$key'] = items.payload.doc['id'];
        this.Site.push(item as Site)
      })
    });
  }

  getMaPackage(site: Site) {
    const startDate = moment(site.maStartDate.seconds * 1000).format('L');
    const endDate = moment(site.maEndDate.seconds * 1000).format('L');
    return startDate + ' - ' + endDate;
  }

  setExpirationDate(site: Site) {
    let color = ''
    const endDate = new Date(site.maEndDate.seconds * 1000)
    const currentDate = new Date()
    if (endDate > currentDate) {
      color = 'currentDate'
    } else {
      color = 'expirationDate'
    }
    return color
  }

}
