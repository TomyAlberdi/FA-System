import { createContext } from 'react';
import { Category, CompleteProduct, Measure, PaginationResponse, Price, ProductStock, Provider, ReturnData, Subcategory } from "@/hooks/CatalogInterfaces";

export interface CatalogContextType {
  BASE_URL: string;
  // CATEGORY GET
  Categories: ReturnData;
  fetchCategories: () => Promise<void>;
  fetchCategory: (id: number) => Promise<Category | undefined>;
  fetchCategoryProducts: (id: number, page: number, size: number) => Promise<PaginationResponse>;
  // SUBCATEGORY GET
  Subcategories: Array<Subcategory>;
  fetchSubcategories: () => Promise<void>;
  fetchSubcategoriesByCategoryId: (id: number) => Promise<Array<Subcategory> | undefined>;
  fetchSubcategoryById: (id: number) => Promise<Subcategory | undefined>;
  fetchSubcategoryProducts: (id: number, page: number, size: number) => Promise<PaginationResponse>;
  // PROVIDER GET
  Providers: ReturnData;
  fetchProviders: () => Promise<void>;
  fetchProvider: (id: number) => Promise<Provider | undefined>;
  fetchProviderProducts: (id: number, page: number, size: number) => Promise<PaginationResponse>;
  // MEASURE GET
  Measures: Array<Measure>;
  fetchMeasures: () => Promise<void>;
  // PRICE GET
  Prices: Price | undefined,
  fetchPrices: () => Promise<void>;
  // PRODUCT GET
  fetchProduct: (id: number) => Promise<CompleteProduct | undefined>;
  // STOCK GET
  fetchProductStock: (id: number) => Promise<ProductStock | undefined>;
  fetchStockListByKeyword: (keyword: string, page: number, size: number) => Promise<PaginationResponse>;
}

export const CatalogContext = createContext<CatalogContextType | null>(null);