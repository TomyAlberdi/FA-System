import {
  Category,
  PaginationResponse,
  PartialCSP,
  ReturnData,
  StockProduct,
} from "@/hooks/CatalogInterfaces";
import { createContext } from "react";

export interface CategoryContextType {
  Categories: ReturnData<Category>;
  fetchCategories: () => Promise<void>;
  fetchCategory: (identifier: number | string) => Promise<Category | undefined>;
  fetchCategoryProducts: (
    id: number,
    page: number,
    size: number
  ) => Promise<PaginationResponse<StockProduct>>;
  createCategory: (name: string) => Promise<PartialCSP | undefined>;
  updateCategory: (id: number, name: string) => Promise<PartialCSP | undefined>;
  deleteCategory: (id: number) => Promise<void>;
}

export const CategoryContext = createContext<CategoryContextType | null>(null);
