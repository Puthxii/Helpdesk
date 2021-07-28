import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { MaLevel } from 'src/app/models/site.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private afs: AngularFirestore) { }

  getProductById(id: string) {
    return this.afs.doc<Product>(`product/` + id).valueChanges();
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

  getModule() {
    return this.afs.collection('module');
  }

  getMaLevel() {
    return this.afs.collection('maintenanceLevel');
  }

  getMaLevelById(id: string) {
    return this.afs.doc<MaLevel>(`maintenanceLevel/` + id).valueChanges();
  }

}
