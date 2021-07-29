import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/models/product.model';
import { MaLevel, Site } from 'src/app/models/site.model';
import { ProductService } from 'src/app/services/product/product.service';
import { SiteService } from 'src/app/services/site/site.service';

@Component({
  selector: 'app-site-general',
  templateUrl: './site-general.component.html',
  styleUrls: ['./site-general.component.css']
})
export class SiteGeneralComponent implements OnInit {
  @Input() id: string

  Site: Site
  site$: Observable<Site>;
  product$: Observable<Product>;
  maLevel$: Observable<MaLevel>;
  constructor(
    private siteService: SiteService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.getSiteById()
  }

  getSiteById() {
    this.site$ = this.siteService.getSiteById(this.id);
    this.site$.subscribe(data => {
      this.Site = data as Site;
      this.getProduct(this.Site.productId)
      this.getMaLevel(this.Site.maLevelId)
    })
  }

  getProduct(id: string) {
    return this.product$ = this.productService.getProductById(id)
  }

  getMaLevel(id: string) {
    return this.maLevel$ = this.productService.getMaLevelById(id)
  }

  getMaPackage(site: Site) {
    const maStartDate = moment(site.maStartDate.seconds * 1000).format('L');
    const maEndDate = moment(site.maEndDate.seconds * 1000).format('L');
    return maStartDate + ' - ' + maEndDate;
  }

  setExpirationDate(site: Site) {
    let color: string
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
