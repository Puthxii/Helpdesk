import { Product } from '../../models/product.model';
import { Site } from '../../models/site.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  constructor(
    private afs: AngularFirestore,
    private router: Router,
  ) { }

  getSitesList() {
    return this.afs.collection<Site>('site').valueChanges().pipe(switchMap(Site => {
      const productIds = (Site.map(Site => Site.productId));
      return combineLatest(of(Site), combineLatest(productIds.map(productId =>
        this.afs.collection<Product>('product', ref =>
          ref.where('id', '==', productId)).valueChanges().pipe(map(product => product[0]))
      )));
    }),
      map(([Site, product]) => {
        return Site.map(Site => {
          return {
            ...Site,
            product: product.find(a => a.id === Site.productId)
          };
        });
      }))
  }

  getSiteByName(site: string) {
    return this.afs.collection<Site>('site', (ref) => ref.where('initials', '==', site)).valueChanges().pipe(switchMap(Site => {
      const productIds = (Site.map(Site => Site.productId));
      return combineLatest(of(Site), combineLatest(productIds.map(productId =>
        this.afs.collection<Product>('product', ref =>
          ref.where('id', '==', productId)).valueChanges().pipe(map(product => product[0]))
      )));
    }),
      map(([Site, product]) => {
        return Site.map(Site => {
          return {
            ...Site,
            product: product.find(a => a.id === Site.productId)
          };
        });
      }))
  }

  getSites() {
    return this.afs.collection('site', (ref) => ref
      .orderBy('nameEN', 'asc'));
  }

  getSitesByNameSort(name) {
    return this.afs.collection('site', (ref) => ref
      .orderBy('nameEN')
      .startAt(name)
      .endAt(name + '\uf8ff'));
  }

  getSitesByName(site: string) {
    return this.afs.collection('site', (ref) => ref.where('initials', '==', site))
  }

  getProvinces() {
    return this.afs.collection('province')
  }

  getSiteById(id: string) {
    return this.afs.doc<Site>(`site/` + id).valueChanges();
  }

  async addSite(site: Site) {
    try {
      (await this.afs.collection('site').add({
        initials: site.initials,
        nameEN: site.nameEN,
        nameTH: site.nameTH,
        productId: site.productId,
        maLevelId: site.maLevelId,
        maStartDate: site.maStartDate,
        maEndDate: site.maEndDate,
        module: site.module,
        addresses: site.addresses
      }).then((docRef) => {
        this.successNotification('site-mng', docRef.id)
      }))
    } catch (error) {
      console.log(error);
    }
  }

  successNotification(path: string, data?: any | null) {
    Swal.fire({
      text: 'Your site has been saved',
      icon: 'success',
    }).then((result: any) => {
      this.router.navigate([`/${path}/${data}`]);
    });
  }

  errorNotification(path: string) {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Your site hasn\'t been saved',
    }).then((result: any) => {
      this.router.navigate([`/${path}`]);
    });
  }
}
