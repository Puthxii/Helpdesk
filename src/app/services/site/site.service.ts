import { Product } from '../../models/product.model';
import { Site } from '../../models/site.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  constructor(private afs: AngularFirestore) { }

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
}
