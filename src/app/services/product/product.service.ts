import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(private afs: AngularFirestore) { }

    getProductById(id: string) {
        this.afs.collection('product').doc(id).ref.get().then(function (doc) {
            if (doc.exists) {
                console.log(doc.data());
            } else {
                console.log('No such document!');
            }
        }).catch(function (error) {
            console.log('Error getting document:', error);
        });
    }

}
