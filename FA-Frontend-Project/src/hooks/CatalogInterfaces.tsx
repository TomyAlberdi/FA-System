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
  measurePrice: number;
  stock: number;
  saleUnit: string;
  measurePerSaleUnit: number;
  saleUnitPrice: number;
}

export interface CompleteProduct extends StockProduct {
  description: string;
  quality: string;
  measures: string;
  discountPercentage: number;
  discountedPrice: number;
  discountedMeasurePrice: number,
  tags: Array<string>;
  images: Array<string>;
  category: string;
  categoryId: number;
  subcategory: string;
  subcategoryId: number;
  provider: string;
  providerId: number;
}

export interface StockRecord {
  recordType: string;
  stockChange: number;
  recordDate: string;
}

export interface ProductStock {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  productSaleUnit: string;
  productMeasureType: string;
  productMeasurePerSaleUnit: number;
  quantity: number;
  stockRecords: Array<StockRecord>;
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
}

export interface PaginationInfo {
  pageNumber: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}