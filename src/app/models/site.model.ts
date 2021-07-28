import { Product } from './product.model';


export interface Site {
  $key: string;
  initials: string;
  nameEN: string;
  nameTH: string;
  productId: string;
  maLevelId: string;
  product: Product;
  maStartDate: any;
  maEndDate: any;
  addresses: Addresses[]
}

export interface MaLevel {
  id: string;
  name: string;
}


export interface Addresses {
  street: string;
  city: string;
  province: string;
  zipCode: string;
}
