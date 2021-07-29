import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { MaLevel } from 'src/app/models/site.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private afs: AngularFirestore,
    private router: Router,
  ) { }

  successNotification(path: string) {
    Swal.fire({
      text: 'Your product has been saved',
      icon: 'success',
    }).then((result: any) => {
      this.router.navigate([`/${path}`]);
    });
  }

  errorNotification(path: string) {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Your product hasn\'t been saved',
    }).then((result: any) => {
      this.router.navigate([`/${path}`]);
    });
  }

  successDelete() {
    Swal.fire({
      icon: 'success',
      title: 'deleted',
      text: 'Your product has been deleted',
    })
  }

  errorDelete() {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Your product hasn\'t  been deleted',
    })
  }

  getProductById(id: string) {
    return this.afs.doc<Product>(`product/` + id).valueChanges();
  }

  getProductList() {
    return this.afs.collection('product', (ref) => ref
      .orderBy('name', 'asc'));
  }

  getProductByNameSort(keyword: string) {
    return this.afs.collection('product', (ref) => ref
      .where('keyword', 'array-contains', keyword)
    );
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

  async addProduct(product: Product) {
    try {
      const keyword = await this.generateKeyword(product.name);
      (await this.afs.collection('product').add({
        name: product.name,
        active: product.active,
        keyword
      }).then(() => {
        this.successNotification('product')
      }))
    } catch (error) {
      this.errorNotification('add-product')
    }
  }

  async updateProduct(id: string, product: Product) {
    try {
      const keyword = await this.generateKeyword(product.name);
      (await this.afs.collection('product').doc(id).update({
        name: product.name,
        active: product.active,
        keyword
      }).then(() => {
        this.successNotification('product')
      }))
    } catch (error) {
      this.errorNotification('edit-product')
    }
  }

  async deleteProductById(id: any) {
    try {
      await this.afs.collection('product').doc(id).delete();
      this.successDelete()
    } catch (err) {
      this.errorDelete()
    }
  }

  private async generateKeyword(name: string) {
    function creatKeywords(str: string) {
      const arrName = []
      let curOrder = ''
      let curName2 = ''
      let curName3 = ''
      let curName4 = ''
      const chars = str.split('');
      for (let i = 0; i < chars.length; i++) {
        curOrder += chars[i]
        if (chars[i + 1] != undefined) {
          curName2 += chars[i]
          curName2 += chars[i + 1]
        }
        if (chars[i + 1] && chars[i + 2] != undefined) {
          curName3 += chars[i]
          curName3 += chars[i + 1]
          curName3 += chars[i + 2]
        }
        if (chars[i + 1] && chars[i + 2] && chars[i + 3] != undefined) {
          curName4 += chars[i]
          curName4 += chars[i + 1]
          curName4 += chars[i + 2]
          curName4 += chars[i + 3]
        }
        arrName.push(curOrder, chars[i], curName2, curName3, curName4)
        curName2 = ''
        curName3 = ''
        curName4 = ''
      }
      return arrName
    }
    const keywordLowerCase = await creatKeywords(name.toLowerCase())
    const keywordUpperCase = await creatKeywords(name.toUpperCase())
    return [
      '',
      ...keywordLowerCase,
      ...keywordUpperCase
    ]
  }

}
