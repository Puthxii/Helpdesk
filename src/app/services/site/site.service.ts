import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SiteService {
    constructor(private afs: AngularFirestore) { }

    getSitesList() {
        return this.afs.collection('site');
    }
}
