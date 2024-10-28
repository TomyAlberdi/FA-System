import { createContext } from 'react';

export interface CatalogContextType {
  BASE_URL: string;
}

export const CatalogContext = createContext<CatalogContextType | null>(null);