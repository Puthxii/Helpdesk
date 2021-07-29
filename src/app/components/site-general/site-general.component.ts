import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAngularMyDpOptions, IMyDate, IMyDateModel } from 'angular-mydatepicker';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { MaLevel, Site } from 'src/app/models/site.model';
import { ProductService } from 'src/app/services/product/product.service';
import { SiteService } from 'src/app/services/site/site.service';

@Component({
  selector: 'app-site-general',
  templateUrl: './site-general.component.html',
  styleUrls: ['./site-general.component.css']
})
export class SiteGeneralComponent implements OnInit {
  @Input() id: string
  Site: Site
  site$: Observable<Site>;
  product$: Observable<Product>;
  maLevel$: Observable<MaLevel>;
  isEdit = false;
  siteForm: any;
  Product: Product[];
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
  Module: any[];
  moduleList: any;
  Provinces: any[];
  minDate(event: IMyDateModel): IMyDate {
    let date: Date
    if (typeof event.singleDate.jsDate.seconds === 'undefined') {
      date = event.singleDate.jsDate
    } else {
      date = new Date(event.singleDate.jsDate.seconds * 1000)
    }
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return { year, month, day }
  }

  maxDate(event: IMyDateModel): IMyDate {
    let date: Date
    if (typeof event.singleDate.jsDate.seconds === 'undefined') {
      date = event.singleDate.jsDate
    } else {
      date = new Date(event.singleDate.jsDate.seconds * 1000)
    }
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return { year, month, day }
  }
  constructor(
    private siteService: SiteService,
    private productService: ProductService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.getSiteById()
    this.buildForm()
    this.getProductEdit()
    this.getMaLevelEdit()
    this.getModule()
    this.getProvinces()
  }

  getSiteById() {
    this.site$ = this.siteService.getSiteById(this.id);
    this.site$.subscribe(data => {
      this.Site = data as Site;
      this.getProduct(this.Site.productId)
      this.getMaLevel(this.Site.maLevelId)
      this.siteForm.patchValue({
        initials: this.Site.initials,
        nameTH: this.Site.nameTH,
        nameEN: this.Site.nameEN,
        productId: this.Site.productId,
        maLevelId: this.Site.maLevelId,
        maStartDate: this.Site.maStartDate,
        maEndDate: this.Site.maEndDate,
        module: this.Site.module,
        addresses: this.Site.addresses,
      })
      this.setAdress(this.Site.addresses)
      this.setMinDate(this.Site.maStartDate)
      this.setMaxDate(this.Site.maEndDate)
    })
  }

  setAdress(addresses: any[]) {
    this.addresses.clear()
    addresses.forEach((address) => {
      const addressForm = this.fb.group({
        street: [address.street, Validators.required],
        city: [address.city, Validators.required],
        province: [address.province, Validators.required],
        zipCode: [address.zipCode, Validators.required]
      });
      this.addresses.push(addressForm);
    })
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

  get addresses() {
    return this.siteForm.controls.addresses as FormArray;
  }

  getProduct(id: string) {
    return this.product$ = this.productService.getProductById(id)
  }

  getMaLevel(id: string) {
    return this.maLevel$ = this.productService.getMaLevelById(id)
  }

  getMaPackage(site: Site) {
    const maStartDate = moment(site.maStartDate.singleDate.jsDate.seconds * 1000).format('L');
    const maEndDate = moment(site.maEndDate.singleDate.jsDate.seconds * 1000).format('L');
    return maStartDate + ' - ' + maEndDate;
  }

  setExpirationDate(site: Site) {
    let color: string
    const endDate = new Date(site.maEndDate.singleDate.jsDate.seconds * 1000)
    const currentDate = new Date()
    if (endDate > currentDate) {
      color = 'currentDate'
    } else {
      color = 'expirationDate'
    }
    return color
  }

  showEdit(value: boolean) {
    this.isEdit = value
  }

  getProductEdit() {
    this.productService.getProductList().snapshotChanges().subscribe(data => {
      this.Product = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$uid'] = items.payload.doc['id'];
        this.Product.push(item as Product)
      })
    });
  }

  getMaLevelEdit() {
    this.productService.getMaLevel().snapshotChanges().subscribe(data => {
      this.MaLevel = []
      data.map(items => {
        const item = items.payload.doc.data();
        item['$uid'] = items.payload.doc['id'];
        this.MaLevel.push(item as MaLevel)
      })
    })
  }

  getModule() {
    this.productService.getModule().snapshotChanges().subscribe(data => {
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
    this.siteService.getProvinces().snapshotChanges().subscribe(data => {
      this.Provinces = [];
      data.map(items => {
        const item = items.payload.doc.data();
        item['$uid'] = items.payload.doc['id'];
        this.Provinces.push(item)
        this.Provinces = this.Provinces[0].province_th
      })
    });
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

  editSite() {
    this.siteService.updateSite(this.siteForm.value, this.id).then(ref => {
      this.addresses.clear()
      this.isEdit = !this.isEdit
    })

  }

}