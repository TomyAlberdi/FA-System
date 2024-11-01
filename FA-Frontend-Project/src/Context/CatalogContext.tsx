import { createContext } from 'react';
import { Category, Provider, StockProduct } from "@/hooks/catalogInterfaces";

export interface CatalogContextType {
  BASE_URL: string;
  // CATEGORY GET
  fetchCategories: () => Promise<Array<Category> | undefined>;
  fetchCategory: (id: number) => Promise<Category | undefined>;
  fetchCategoryProducts: (id: number) => Promise<Array<StockProduct> | undefined>;
  // PROVIDER GET
  fetchProviders: () => Promise<Array<Provider> | undefined>;
  fetchProvider: (id: number) => Promise<Provider | undefined>;
  fetchProviderProducts: (id: number) => Promise<Array<StockProduct> | undefined>;
}

export const CatalogContext = createContext<CatalogContextType | null>(null);