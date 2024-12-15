export interface Category {
  id: number;
  name: string;
  productsAmount: number;
  subcategories: Array<Subcategory>;
}

export interface Subcategory {
  id: number;
  categoryId: number;
  name: string;
  productsAmount: number;
}

export interface Provider {
  id: number;
  name: string;
  locality: string;
  address: string;
  phone: string;
  email: string;
  cuit: string;
  productsAmount: number;
  productsDiscount: number;
}

export interface Measure {
  measure: string;
  products: number;
}

export interface Price {
  "minPrice": number;
  "maxPrice": number;
}

export interface CardProduct {
  id: number,
  name: string,
  disabled: boolean,
  measureType: string,
  measurePrice: number,
  saleUnit: string, 
  saleUnitPrice: number,
  measurePerSaleUnit: number,
  discountPercentage: number, 
  discountedPrice: number,
  discountedMeasurePrice: number,
  image: string,
}

export interface StockProduct {
  id: number;
  name: string;
  disabled: boolean;
  measureType: string;
  stock: number;
  saleUnit: string;
  measurePerSaleUnit: number;
  saleUnitPrice: number;
  discountPercentage: number;
  discountedPrice: number;
}

export interface CompleteProduct extends StockProduct {
  description: string;
  quality: string;
  measures: string;
  discountedMeasurePrice: number,
  images: Array<string>;
  category: string;
  categoryId: number;
  measurePrice: number;
  subcategory: string;
  subcategoryId: number;
  provider: string;
  providerId: number;
  characteristics: Array<characteristic>;
  color: string;
  origen: string;
  borde: string;
  aspecto: string;
  textura: string;
  transito: string;
}

export interface PartialProductStock {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  productSaleUnit: string;
  quantity: number;
}

export interface ProductStock extends PartialProductStock {
  productMeasureType: string;
  productMeasurePerSaleUnit: number;
  stockRecords: Array<StockRecord>;
}

export interface StockRecord {
  recordType: string;
  stockChange: number;
  recordDate: string;
}

export interface StockRecordInfo {
  productId: number;
  productName: string;
  productSaleUnit: string;
  record: StockRecord;
}

export interface FilterData {
  type: string;
  value: number | string | boolean;
}

export interface BasicFilterCheck {
  id: number;
  name: string;
  productsAmount: number;
  checked: boolean;
}

export interface MeasureCheck {
  id: number,
  measure: string;
  productsAmount: number;
  checked: boolean;
}

export interface PriceCheck {
  minPrice: number;
  maxPrice: number;
}

export interface BasicFilterProps {
  Filter: Array<FilterData | null>;
  setFilter: (value: Array<FilterData | null>) => void;
  Loading: boolean
}

export interface PaginationInfo {
  pageNumber: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}

export interface PaginationResponse {
  content: Array<never>;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    },
    offset: number;
    paged: boolean;
    unpaged: boolean;
  },
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  },
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface characteristic {
  key: string;
  value: string | null;
}

export interface StockReport {
  month: string;
  in: number;
  out: number;
}