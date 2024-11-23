import { createContext } from 'react';
import { Category, CompleteProduct, Measure, PaginationResponse, Price, ProductStock, Provider, Subcategory } from "@/hooks/CatalogInterfaces";

export interface CatalogContextType {
  BASE_URL: string;
  // CATEGORY GET
  fetchCategories: () => Promise<Array<Category> | undefined>;
  fetchCategory: (id: number) => Promise<Category | undefined>;
  fetchCategoryProducts: (id: number, page: number, size: number) => Promise<PaginationResponse>;
  // SUBCATEGORY GET
  fetchSubcategories: () => Promise<Array<Subcategory> | undefined >;
  fetchSubcategoriesByCategoryId: (id: number) => Promise<Array<Subcategory> | undefined>;
  fetchSubcategoryById: (id: number) => Promise<Subcategory | undefined>;
  fetchSubcategoryProducts: (id: number, page: number, size: number) => Promise<PaginationResponse>;
  // PROVIDER GET
  fetchProviders: () => Promise<Array<Provider> | undefined>;
  fetchProvider: (id: number) => Promise<Provider | undefined>;
  fetchProviderProducts: (id: number, page: number, size: number) => Promise<PaginationResponse>;
  // MEASURE GET
  fetchMeasures: () => Promise<Array<Measure> | undefined>;
  // PRICE GET
  fetchPrices: () => Promise<Price | undefined>;
  // PRODUCT GET
  fetchProduct: (id: number) => Promise<CompleteProduct | undefined>;
  // STOCK GET
  fetchProductStock: (id: number) => Promise<ProductStock | undefined>;
  fetchStockListByKeyword: (keyword: string, page: number, size: number) => Promise<PaginationResponse>;
}

export const CatalogContext = createContext<CatalogContextType | null>(null);