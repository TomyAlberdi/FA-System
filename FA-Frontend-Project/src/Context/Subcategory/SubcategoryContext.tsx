import {
  PaginationResponse,
  ReturnData,
  StockProduct,
  Subcategory,
} from "@/hooks/CatalogInterfaces";
import { createContext } from "react";

export interface SubcategoryContextType {
  Subcategories: ReturnData<Subcategory>;
  fetchSubcategories: () => Promise<void>;
  fetchSubcategory: (
    identifier: number | string
  ) => Promise<Subcategory | undefined>;
  fetchSubcategoriesByCategoryId: (
    id: number
  ) => Promise<Array<Subcategory> | undefined>;
  fetchSubcategoryProducts: (
    id: number,
    page: number,
    size: number
  ) => Promise<PaginationResponse<StockProduct>>;
  createSubcategory: (
    categoryId: number,
    name: string
  ) => Promise<Subcategory | undefined>;
  updateSubcategory: (
    id: number,
    name: string
  ) => Promise<Subcategory | undefined>;
  deleteSubcategory: (id: number) => Promise<void>;
}

export const SubcategoryContext = createContext<SubcategoryContextType | null>(
  null
);
