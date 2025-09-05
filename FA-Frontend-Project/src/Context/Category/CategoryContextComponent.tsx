import {
  CategoryContext,
  CategoryContextType,
} from "@/Context/Category/CategoryContext";
import { Category, PartialCSP, ReturnData } from "@/hooks/CatalogInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { ReactNode, useEffect, useState } from "react";

interface CategoryContextComponentProps {
  children: ReactNode;
}

const CategoryContextComponent: React.FC<CategoryContextComponentProps> = ({
  children,
}) => {
  const { getToken } = useKindeAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [Categories, setCategories] = useState<ReturnData<Category>>({
    Loading: true,
    data: Array<Category>(),
  });

  const fetchCategories = async () => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/category`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        return;
      }
      const result: Array<Category> = await response.json();
      setCategories({ Loading: false, data: result });
    } catch (error) {
      console.error("Error fetching categories: ", error);
      setCategories({ Loading: false, data: [] });
    }
  };

  const fetchCategory = async (identifier: number | string) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/category/${identifier}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
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
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(
        `${BASE_URL}/category/${id}/products?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
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
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/category/${name}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(
        `${BASE_URL}/category/${id}?` +
          new URLSearchParams({ name }).toString(),
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
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

  const deleteCategory = async (id: number) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/category/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching Category: ", response.statusText);
        return;
      }
      return;
    } catch (error) {
      console.error("Error fetching Category: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (getToken) {
        const accessToken = await getToken();
        if (accessToken) {
          fetchCategories();
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken]);

  const exportData: CategoryContextType = {
    Categories,
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
