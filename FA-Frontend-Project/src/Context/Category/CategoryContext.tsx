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
  updateCategory: (id: number, name: string) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  CategoryUpdater: number;
}

export const CategoryContext = createContext<CategoryContextType | null>(null);
