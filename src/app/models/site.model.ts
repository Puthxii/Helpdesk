import { Product } from './product.model';
export interface Site {
    $key: string;
    sid: string;
    initials: string;
    nameEN: string;
    nameTH: string;
    productId: string;
    maLevelId: string;
    product: Product;
    maStartDate: any;
    maEndDate: any;
}

export interface MaLevel {
    id: string;
    name: string;
}
