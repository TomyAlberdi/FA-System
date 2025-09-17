import {
  CreateProviderDTO,
  PaginationResponse,
  Provider,
  StockProduct
} from "@/hooks/CatalogInterfaces";
import { createContext } from "react";

export interface ProviderContextType {
  fetchProviders: () => Promise<Provider[]>;
  fetchProvider: (identifier: number | string) => Promise<Provider | undefined>;
  fetchProviderProducts: (
    id: number,
    page: number,
    size: number
  ) => Promise<PaginationResponse<StockProduct>>;
  createProvider: (dto: CreateProviderDTO) => Promise<Provider | undefined>;
  updateProvider: (
    id: number,
    dto: CreateProviderDTO
  ) => Promise<Provider | undefined>;
  deleteProvider: (id: number) => Promise<void>;
}

export const ProviderContext = createContext<ProviderContextType | null>(null);
