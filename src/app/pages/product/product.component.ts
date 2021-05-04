import { ProductService } from './../../services/product/product.service';
import { Product } from './../../models/product.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  p = 1;
  Product: Product[];
  hideWhenNoStaff = false;
  noData = false;
  preLoader = true;
  searchValue = '';

  constructor(
    private product: ProductService
  ) { }

  ngOnInit() {
    this.dataState();
    this.product.getProductList().snapshotChanges().subscribe(data => {
      this.Product = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$uid'] = items.payload.doc['id'];
        this.Product.push(item as Product)
      })
    });
  }

  dataState() {
    this.product.getProductList().snapshotChanges().subscribe(data => {
      this.preLoader = false;
      if (data.length <= 0) {
        this.hideWhenNoStaff = false;
        this.noData = true;
      } else {
        this.hideWhenNoStaff = true;
        this.noData = false;
      }
    });
  }

  search() {
    const searchValue = this.searchValue
    if (searchValue != null) {
      this.getProductByNameSort(searchValue)
    }
  }

  getProductByNameSort(searchValue: any) {
    this.product.getProductByNameSort(searchValue).snapshotChanges().subscribe(data => {
      this.Product = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$uid'] = items.payload.doc['id'];
        this.Product.push(item as Product)
      })
    });
  }

  getActive(product: Product) {
    let active: string
    if (product.active) {
      active = 'True'
    } else {
      active = 'False'
    }
    return active
  }

}
