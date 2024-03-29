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
  module: any
  addresses: Addresses[]
  keyword: any;
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

export interface Server {
  id?: string;
  serverIpName: string;
  serverDescription: any;
  serverType: string;
  userLogin: UserLogin[]
}
export interface UserLogin {
  userName: string;
  password: string;
}