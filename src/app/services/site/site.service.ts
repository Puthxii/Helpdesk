import { Product } from './../product/product.model';
import { Site } from './site.model';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { flatMap, map, switchMap, take, } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SiteService {

    constructor(private afs: AngularFirestore) { }

    getSitesList() {
        return this.afs.collection<Site>('site').valueChanges()
            .pipe(
                switchMap(Site => {
                    const productIds = (Site.map(Site => Site.productId));
                    return combineLatest(
                        of(Site),
                        combineLatest(
                            productIds.map(productId =>
                                this.afs
                                    .collection<Product>('product', ref =>
                                        ref.where('id', '==', productId)
                                    )
                                    .valueChanges()
                                    .pipe(map(product => product[0]))
                            )
                        )
                    );
                }),
                map(([Site, product]) => {
                    return Site.map(Site => {
                        return {
                            ...Site,
                            product: product.find(a => a.id === Site.productId)
                        };
                    });
                })
            )
    }
}
