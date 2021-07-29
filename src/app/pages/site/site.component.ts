import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site/site.service';
import { Site } from 'src/app/models/site.model';
import * as moment from 'moment';
import { DataService } from 'src/app/services/data/data.service';
import Swal from 'sweetalert2';

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
    private siteService: SiteService,
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.getSitesList()
    this.dataState();
  }

  getSitesList() {
    this.siteService.getSites().snapshotChanges().subscribe(data => {
      this.Site = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$key'] = items.payload.doc['id'];
        this.Site.push(item as Site)
      })
    });
  }

  dataState() {
    this.siteService.getSites().snapshotChanges().subscribe(data => {
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
    if (this.searchValue !== undefined && this.searchValue !== null && this.searchValue !== '') {
      this.getSitesByNameSort(this.searchValue)
      this.dataStateSearch(this.searchValue)
    } else {
      this.getSitesList()
      this.dataState()
    }
  }

  dataStateSearch(searchValue: string) {
    this.siteService.getSitesByNameSort(searchValue).snapshotChanges().subscribe(data => {
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

  getSitesByNameSort(searchValue: any) {
    this.siteService.getSitesByNameSort(searchValue).snapshotChanges().subscribe(data => {
      this.Site = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$key'] = items.payload.doc['id'];
        this.Site.push(item as Site)
      })
    });
  }

  getMaPackage(site: Site) {
    if (site.maStartDate.singleDate) {
      const startDate = moment(site.maStartDate.singleDate.jsDate.seconds * 1000).format('L');
      const endDate = moment(site.maEndDate.singleDate.jsDate.seconds * 1000).format('L');
      return startDate + ' - ' + endDate;
    }
    return 'invalid'

  }

  setExpirationDate(site: Site) {
    let color = ''
    if (site.maStartDate.singleDate) {
      const endDate = new Date(site.maEndDate.singleDate.jsDate.seconds * 1000)
      const currentDate = new Date()
      if (endDate > currentDate) {
        color = 'currentDate'
      } else {
        color = 'expirationDate'
      }
      return color
    }
    return color = 'expirationDate'
  }

  newPath() {
    this.dataService.changeRedirectSource('site')
  }

  alertDeleteSite(site) {
    Swal.fire({
      title: 'Do you want to delete site?',
      text: site.nameEN,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2ED0B9',
      cancelButtonColor: '#9C9FA6',
      confirmButtonText: 'Yes, I do'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.siteService.deleteSiteById(site.$key)
      }
    })
  }

}
