import { createContext } from 'react';

interface Category {
  id: number;
  name: string;
  productsAmount: number;
}

interface Provider {
  id: number;
  name: string;
  productsAmount: number;
}

export interface CatalogContextType {
  BASE_URL: string;
  fetchCategories: () => Promise<Array<Category> | undefined>;
  fetchProviders: () => Promise<Array<Provider> | undefined>;
}

export const CatalogContext = createContext<CatalogContextType | null>(null);