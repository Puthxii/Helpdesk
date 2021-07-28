import { MaLevel } from './../../models/site.model';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IAngularMyDpOptions, IMyDate, IMyDateModel } from 'angular-mydatepicker';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ProductService } from 'src/app/services/product/product.service';
import { SiteService } from 'src/app/services/site/site.service';
import Swal from 'sweetalert2';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-add-site',
  templateUrl: './add-site.component.html',
  styleUrls: ['./add-site.component.css']
})
export class AddSiteComponent implements OnInit {
  siteForm: FormGroup;
  Product: Product[];
  Module: any[]
  moduleList: any[];
  Provinces: any[];
  MaLevel: MaLevel[];
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    noDataAvailablePlaceholderText: 'Please choose module',
    allowSearchFilter: true,
    enableCheckAll: true,
  };
  myOptions1: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
  };
  myOptions2: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
  };
  constructor(
    private fb: FormBuilder,
    private site: SiteService,
    private product: ProductService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.getProduct()
    this.getModule()
    this.getProvinces()
    this.getMaLevel()
    this.buildForm()
    this.addAddress()
  }

  minDate(event: IMyDateModel): IMyDate {
    const date = event.singleDate.jsDate
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return { year, month, day }
  }

  maxDate(event: IMyDateModel): IMyDate {
    const date = event.singleDate.jsDate
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return { year, month, day }
  }

  private buildForm() {
    this.siteForm = this.fb.group({
      initials: ['', [Validators.required]],
      nameTH: ['', [Validators.required]],
      nameEN: ['', [Validators.required]],
      productId: ['', [Validators.required]],
      maLevelId: ['', [Validators.required]],
      maStartDate: ['', [Validators.required]],
      maEndDate: ['', [Validators.required]],
      module: ['', [Validators.required]],
      addresses: this.fb.array([])
    })
  }

  get addresses() {
    return this.siteForm.controls.addresses as FormArray;
  }

  addAddress() {
    const addressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      zipCode: ['', Validators.required],
    });
    this.addresses.push(addressForm);
  }

  deleteAddress(addressIndex: number) {
    this.addresses.removeAt(addressIndex);
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

  get module() {
    return this.siteForm.get('module');
  }

  get maStartDate() {
    return this.siteForm.get('maStartDate');
  }

  get maEndDate() {
    return this.siteForm.get('maEndDate');
  }

  get maLevelId() {
    return this.siteForm.get('maLevelId');
  }


  addSite() {
    this.reformeteStartDate(this.siteForm.controls.maStartDate.value)
    this.reformeteEndDate(this.siteForm.controls.maEndDate.value)
    this.site.addSite(this.siteForm.value)
  }

  reformeteStartDate(maStartDate: { singleDate: { jsDate: any; }; }) {
    this.siteForm.patchValue({
      maStartDate: maStartDate.singleDate.jsDate
    })
  }

  reformeteEndDate(maEndDate: { singleDate: { jsDate: any; }; }) {
    this.siteForm.patchValue({
      maEndDate: maEndDate.singleDate.jsDate
    })
  }

  alertCancelAddCustomer() {
    Swal.fire({
      title: 'Do you want to cancel add site.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2ED0B9',
      cancelButtonColor: '#9C9FA6',
      confirmButtonText: 'Yes, I do'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.router.navigate([`/site`]);
      }
    })
  }

  getProduct() {
    this.product.getProductList().snapshotChanges().subscribe(data => {
      this.Product = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$uid'] = items.payload.doc['id'];
        this.Product.push(item as Product)
      })
    });
  }

  getModule() {
    this.product.getModule().snapshotChanges().subscribe(data => {
      this.Module = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$uid'] = items.payload.doc['id'];
        this.Module.push(item)
        this.moduleList = this.Module[0].module
      })
    })
  }

  getProvinces() {
    this.site.getProvinces().snapshotChanges().subscribe(data => {
      this.Provinces = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$uid'] = items.payload.doc['id'];
        this.Provinces.push(item)
        this.Provinces = this.Provinces[0].province_th
      })
    });
  }

  getMaLevel() {
    this.product.getMaLevel().snapshotChanges().subscribe(data => {
      this.MaLevel = []
      data.map(items => {
        const item = items.payload.doc.data();
        item['$uid'] = items.payload.doc['id'];
        this.MaLevel.push(item as MaLevel)
      })
    })
  }

  setMinDate($event: IMyDateModel) {
    this.myOptions2 = {
      dateRange: false,
      dateFormat: 'dd/mm/yyyy',
      disableUntil: this.minDate($event),
    };
  }

  setMaxDate($event: IMyDateModel) {
    this.myOptions1 = {
      dateRange: false,
      dateFormat: 'dd/mm/yyyy',
      disableSince: this.maxDate($event),
    };
  }

}
