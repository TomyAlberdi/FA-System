import {
  CategoryContext,
  CategoryContextType,
} from "@/Context/Category/CategoryContext";
import { Category, PartialCSP } from "@/hooks/CatalogInterfaces";
// removed getToken-based auth
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface CategoryContextComponentProps {
  children: ReactNode;
}

const CategoryContextComponent: React.FC<CategoryContextComponentProps> = ({
  children,
}) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const fetchCategories = async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${BASE_URL}/category`);
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        return [];
      }
      const result: Array<Category> = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching categories: ", error);
      return [];
    }
  };

  const fetchCategory = async (identifier: number | string) => {
    try {
      const response = await fetch(`${BASE_URL}/category/${identifier}`);
      if (!response.ok) {
        console.error("Error fetching Category: ", response.statusText);
        return;
      }
      const result: Category = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Category: ", error);
    }
  };

  const fetchCategoryProducts = async (
    id: number,
    page: number,
    size: number
  ) => {
    try {
      const response = await fetch(
        `${BASE_URL}/category/${id}/products?page=${page}&size=${size}`
      );
      if (!response.ok) {
        console.error("Error fetching Category: ", response.statusText);
        window.alert(
          `Error obteniendo los productos de la categoría: ${response.status}`
        );
        return;
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Provider: ", error);
    }
  };

  const createCategory = async (name: string) => {
    try {
      const response = await fetch(`${BASE_URL}/category/${name}`, {
        method: "POST",
      });
      if (!response.ok) {
        console.error("Error fetching Category: ", response.statusText);
        return;
      }
      const result: PartialCSP = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Category: ", error);
    }
  };

  const updateCategory = async (id: number, name: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/category/${id}?` +
          new URLSearchParams({ name }).toString(),
        {
          method: "PATCH",
        }
      );
      if (!response.ok) {
        console.error("Error fetching Category: ", response.statusText);
        return;
      }
    } catch (error) {
      console.error("Error fetching Category: ", error);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/category/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        console.error("Error fetching Category: ", response.statusText);
        return;
      }
      navigate(-1);
    } catch (error) {
      console.error("Error fetching Category: ", error);
    }
  };

  const exportData: CategoryContextType = {
    fetchCategories,
    fetchCategory,
    fetchCategoryProducts,
    createCategory,
    updateCategory,
    deleteCategory,
  };

  return (
    <CategoryContext.Provider value={exportData}>
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryContextComponent;
