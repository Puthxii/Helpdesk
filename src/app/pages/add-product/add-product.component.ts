import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  Status = [true, false]
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.buildForm()
  }

  buildForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      active: ['', [Validators.required]],
    })
  }

  get name() {
    return this.productForm.get('name')
  }

  get active() {
    return this.productForm.get('active')
  }

  addProduct() {
    this.productService.addProduct(this.productForm.value)
  }

  alertCancelAddProduct() {
    Swal.fire({
      title: 'Do you want to cancel add product.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2ED0B9',
      cancelButtonColor: '#9C9FA6',
      confirmButtonText: 'Yes, I do'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.router.navigate([`/product`]);
      }
    })
  }

}
