import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site/site.service';
import { Site } from 'src/app/models/site.model';

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
        item['$uid'] = items.payload.doc['id'];
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
        item['$uid'] = items.payload.doc['id'];
        this.Site.push(item as Site)
      })
    });
  }

}
