import {
  PaginationResponse,
  PartialProductStock,
  ProductStock,
  StockChangeType,
} from "@/hooks/CatalogInterfaces";
import { createContext } from "react";

export interface StockContextType {
  fetchStockByProduct: (id: number) => Promise<ProductStock | undefined>;
  fetchStocks: (
    keyword: string,
    page: number,
    size: number
  ) => Promise<PaginationResponse<PartialProductStock>>;
  changeStock: (
    productId: number,
    quantity: number,
    type: StockChangeType
  ) => Promise<void>;
}

export const StockContext = createContext<StockContextType | null>(null);
