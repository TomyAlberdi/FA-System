import {
  SubcategoryContext,
  SubcategoryContextType,
} from "@/Context/Subcategory/SubcategoryContext";
import { Subcategory } from "@/hooks/CatalogInterfaces";
// removed getToken-based auth
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface CategoryContextComponentProps {
  children: ReactNode;
}

const SubcategoryContextComponent: React.FC<CategoryContextComponentProps> = ({
  children,
}) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const fetchSubcategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/category/subcategory`);
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        window.alert(
          "Ocurrió un error al obtener las subcategorías: " + response.status
        );
        return [];
      }
      const result: Array<Subcategory> = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching subcategories: ", error);
      return [];
    }
  };

  const fetchSubcategory = async (identifier: number | string) => {
    try {
      const response = await fetch(`${BASE_URL}/category/subcategory/${identifier}`);
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        window.alert(
          "Ocurrió un error al obtener la subcategoría: " + response.status
        );
        return;
      }
      const result: Subcategory = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching subcategory: ", error);
    }
  };

  const fetchSubcategoriesByCategoryId = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/category/${id}/subcategories`);
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        window.alert(
          "Ocurrió un error al obtener las subcategorías: " + response.status
        );
        return;
      }
      const result: Array<Subcategory> = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching subcategories: ", error);
    }
  };

  const fetchSubcategoryProducts = async (
    id: number,
    page: number,
    size: number
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/category/subcategory/${id}/products?page=${page}&size=${size}`);
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        window.alert(
          "Ocurrió un error al obtener los productos de la subcategoría: " +
            response.status
        );
        return;
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching subcategory products: ", error);
    }
  };

  const createSubcategory = async (categoryId: number, name: string) => {
    try {
      const response = await fetch(`${BASE_URL}/category/${categoryId}/subcategory/${name}`, {
        method: "POST",
      });
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        window.alert(
          "Ocurrió un error al crear la subcategoría: " + response.status
        );
        return;
      }
      const result: Subcategory = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching subcategory: ", error);
    }
  };

  const updateSubcategory = async (id: number, name: string) => {
    try {
      const response = await fetch(`${BASE_URL}/category/subcategory/${id}/${name}`, {
        method: "PATCH",
      });
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        window.alert(
          "Ocurrió un error al actualizar la subcategoría: " + response.status
        );
        return;
      }
      const result: Subcategory = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching subcategory: ", error);
    }
  };

  const deleteSubcategory = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/category/subcategory/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        return;
      }
      navigate(-1);
    } catch (error) {
      console.error("Error fetching subcategory: ", error);
    }
  };

  const exportData: SubcategoryContextType = {
    fetchSubcategories,
    fetchSubcategory,
    fetchSubcategoriesByCategoryId,
    fetchSubcategoryProducts,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
  };

  return (
    <SubcategoryContext.Provider value={exportData}>
      {children}
    </SubcategoryContext.Provider>
  );
};

export default SubcategoryContextComponent;
