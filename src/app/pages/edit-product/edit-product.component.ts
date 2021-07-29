import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product/product.service';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  id: string;
  productForm: FormGroup;
  product: Product;
  Status = [true, false]
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private userService: UserService,
    public route: ActivatedRoute,
    private productService: ProductService,
  ) {
    this.route.params.subscribe(params => this.id = params.id)
  }

  ngOnInit() {
    this.buildForm()
    this.getProduct()
  }

  getProduct() {
    this.productService.getProductById(this.id).subscribe(product => {
      this.product = product
      this.productForm.patchValue({
        name: this.product.name,
        active: this.product.active
      })
    })
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

  editProduct() {
    this.productService.updateProduct(this.id, this.productForm.value);
  }

  alertCancelEditProduct() {
    Swal.fire({
      title: 'Do you want to cancel edit product.',
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
