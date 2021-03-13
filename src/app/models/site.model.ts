import { Product } from './product.model';
export interface Site {
    $key: string;
    initials: string;
    nameEN: string;
    nameTH: string;
    productId: string;
    maLevelId: string;
    product: Product;
}

export interface MaLevel {
    id: string;
    name: string;
}