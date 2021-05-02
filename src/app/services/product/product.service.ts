import { AngularFirestore } from '@angular/fire/firestore';
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

  getProductList() {
    return this.afs.collection('product', (ref) => ref
      .orderBy('name', 'asc'));
  }

  getProductByNameSort(name) {
    return this.afs.collection('product', (ref) => ref
      .orderBy('name')
      .startAt(name)
      .endAt(name + '\uf8ff'));
  }

}
