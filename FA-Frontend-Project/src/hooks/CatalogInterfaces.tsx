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