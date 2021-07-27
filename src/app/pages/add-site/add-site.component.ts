import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Product} from "../../models/product.model";
import {Addresses} from "../../models/site.model";

@Component({
  selector: 'app-add-site',
  templateUrl: './add-site.component.html',
  styleUrls: ['./add-site.component.css']
})
export class AddSiteComponent implements OnInit {
  siteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm()
  }

  private buildForm() {
    this.siteForm = this.fb.group({
      initials: [''],
      nameTH: [''],
      nameEN: [''],
      productId: [''],
      maLevelId: [''],
      product: [''],
      addresses: this.fb.group({
        street: [''],
        city: [''],
        province: [''],
        zipCode: [''],
      }),
    })
  }


  get initials() {
    return this.siteForm.get('initials');
  }

  get nameTH() {
    return this.siteForm.get('nameTH');
  }

  get nameEN() {
    return this.siteForm.get('nameEN');
  }

  get productId() {
    return this.siteForm.get('productId');
  }



  addSite() {

  }

  alertCancelAddCustomer() {

  }
}
