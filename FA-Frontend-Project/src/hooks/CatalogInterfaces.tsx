export interface Category {
  id: number;
  name: string;
  productsAmount: number;
}

export interface Provider {
  id: number;
  name: string;
  productsAmount: number;
}

export interface Measure {
  measure: string;
  productsAmount: number;
}

export interface CardProduct {
  id: number,
  name: string,
  price: number,
  salesUnit: string, 
  priceSaleUnit: number,
  discountPercentage: number, 
  discountedPrice: number,
  image: string,
}

export interface StockProduct {
  id: number;
  name: string;
  stock: number;
  saleUnit: string;
  unitPerBox: number;
  price: number;
}

export interface FilterData {
  type: string;
  value: number | string;
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

export interface BasicFilterProps {
  Filter: Array<FilterData | null>;
  setFilter: (value: Array<FilterData | null>) => void;
}