import { Product } from './../product/product.model';
import { Site } from './site.model';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { flatMap, map, take, } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';

@Injectable({
    providedIn: 'root'
})
export class SiteService {
    siteCollection: AngularFirestoreCollection<Site>;
    siteItem: Observable<Site[]>;
    Site: Site[];
    constructor(private afs: AngularFirestore) { }

    getSitesList() {
        this.siteCollection = this.afs.collection('site');
        this.siteItem = this.siteCollection.snapshotChanges().pipe(map(changes => {
            return changes.map(change => {
                const data = change.payload.doc.data() as Site;
                const productId = data.productId;
                return this.afs.collection('product').doc(productId).valueChanges().pipe(map((productData: Product) => {
                    return Object.assign({
                        productName: productData.name,
                        initials: data.initials,
                        nameEN: data.nameEN,
                        nameTH: data.nameTH
                    });
                }
                ));
            });
        }), flatMap(Site => combineLatest(Site)));
        return this.siteItem;
    }
}
