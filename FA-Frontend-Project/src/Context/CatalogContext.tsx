import { createContext } from 'react';
import { Category, Measure, Price, Provider, StockProduct, Subcategory } from "@/hooks/CatalogInterfaces";

export interface CatalogContextType {
  BASE_URL: string;
  // CATEGORY GET
  fetchCategories: () => Promise<Array<Category> | undefined>;
  fetchCategory: (id: number) => Promise<Category | undefined>;
  fetchCategoryProducts: (id: number) => Promise<Array<StockProduct> | undefined>;
  // SUBCATEGORY GET
  fetchSubcategories: () => Promise<Array<Subcategory> | undefined >;
  fetchSubcategoriesByCategoryId: (id: number) => Promise<Array<Subcategory> | undefined>;
  fetchSubcategoryById: (id: number) => Promise<Subcategory | undefined>;
  fetchSubcategoryProducts: (id: number) => Promise<Array<StockProduct> | undefined>;
  // PROVIDER GET
  fetchProviders: () => Promise<Array<Provider> | undefined>;
  fetchProvider: (id: number) => Promise<Provider | undefined>;
  fetchProviderProducts: (id: number) => Promise<Array<StockProduct> | undefined>;
  // MEASURE GET
  fetchMeasures: () => Promise<Array<Measure> | undefined>;
  // PRICE GET
  fetchPrices: () => Promise<Price | undefined>;
}

export const CatalogContext = createContext<CatalogContextType | null>(null);