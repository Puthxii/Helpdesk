import { ProductService } from './../../services/product/product.service';
import { Product } from './../../models/product.model';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
    private productService: ProductService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.dataState();
    this.getProduct()
  }

  getProduct() {
    this.productService.getProductList().snapshotChanges().subscribe(data => {
      this.Product = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$uid'] = items.payload.doc['id'];
        this.Product.push(item as Product)
      })
    });
  }

  dataState() {
    this.productService.getProductList().snapshotChanges().subscribe(data => {
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
    if (this.searchValue !== undefined && this.searchValue !== null && this.searchValue !== '') {
      this.getProductByNameSort(this.searchValue)
      this.dataStateSearch(this.searchValue)
    } else {
      this.dataState();
      this.getProduct()
    }
  }

  dataStateSearch(searchValue: string) {
    this.productService.getProductByNameSort(searchValue).snapshotChanges().subscribe(data => {
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

  getProductByNameSort(searchValue: any) {
    this.productService.getProductByNameSort(searchValue).snapshotChanges().subscribe(data => {
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

  alertDeleteProduct(product: any) {
    Swal.fire({
      title: 'Do you want to delete product.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2ED0B9',
      cancelButtonColor: '#9C9FA6',
      confirmButtonText: 'Yes, I do'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.productService.deleteProductById(product.$uid)
      }
    })
  }

}
