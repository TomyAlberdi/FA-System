import { CompleteProduct, CreateProductDTO, Measure, Price, ReturnData } from "@/hooks/CatalogInterfaces";
import { createContext } from "react";

export interface ProductContextType {
  fetchProduct: (id: number) => Promise<CompleteProduct | undefined>;
  createProduct: (dto: CreateProductDTO) => Promise<void>;
  updateProduct: (id: number, dto: CreateProductDTO) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  Measures: ReturnData<Measure>,
  fetchMeasures: () => Promise<void>;
  Prices: ReturnData<Price>;
  fetchPrices: () => Promise<void>;
}

export const ProductContext = createContext<ProductContextType | null>(null);