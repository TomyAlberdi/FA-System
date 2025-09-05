import {
  Category,
  PaginationResponse,
  PartialCSP,
  ReturnData,
} from "@/hooks/CatalogInterfaces";
import { createContext } from "react";

export interface CategoryContextType {
  Categories: ReturnData;
  fetchCategories: () => Promise<void>;
  fetchCategory: (id: number) => Promise<Category | undefined>;
  fetchCategoryProducts: (
    id: number,
    page: number,
    size: number
  ) => Promise<PaginationResponse>;
  createCategory: (name: string) => Promise<PartialCSP | undefined>;
  updateCategory: (id: number, name: string) => Promise<PartialCSP | undefined>;
  deleteCategory: (id: number) => Promise<void>;
}

export const CategoryContext = createContext<CategoryContextType | null>(null);