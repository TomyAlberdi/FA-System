import {
  SubcategoryContext,
  SubcategoryContextType,
} from "@/Context/Subcategory/SubcategoryContext";
import { ReturnData, Subcategory } from "@/hooks/CatalogInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CategoryContextComponentProps {
  children: ReactNode;
}

const SubcategoryContextComponent: React.FC<CategoryContextComponentProps> = ({
  children,
}) => {
  const { getToken } = useKindeAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [Subcategories, setSubcategories] = useState<ReturnData<Subcategory>>({
    Loading: true,
    data: Array<Subcategory>(),
  });

  const fetchSubcategories = async () => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/category/subcategory`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        window.alert("Ocurrió un error al obtener las subcategorías: " + response.status);
      }
      const result: Array<Subcategory> = await response.json();
      setSubcategories({ Loading: false, data: result });
    } catch (error) {
      console.error("Error fetching subcategories: ", error);
      setSubcategories({ Loading: false, data: [] });
    }
  };

  const fetchSubcategory = async (identifier: number | string) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(
        `${BASE_URL}/category/subcategory/${identifier}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        window.alert("Ocurrió un error al obtener la subcategoría: " + response.status);
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
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/category/${id}/subcategories`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        window.alert("Ocurrió un error al obtener las subcategorías: " + response.status);
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
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(
        `${BASE_URL}/category/subcategory/${id}/products?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        window.alert("Ocurrió un error al obtener los productos de la subcategoría: " + response.status);
        return;
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching subcategory products: ", error);
    }
  };

  const [SubcategoryUpdater, SetSubcategoryUpdater] = useState(0);

  const createSubcategory = async (categoryId: number, name: string) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(
        `${BASE_URL}/category/${categoryId}/subcategory/${name}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        window.alert("Ocurrió un error al crear la subcategoría: " + response.status);
        return;
      }
      await fetchSubcategories();
      SetSubcategoryUpdater((prev) => prev + 1);
      const result: Subcategory = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching subcategory: ", error);
    }
  };

  const updateSubcategory = async (id: number, name: string) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(
        `${BASE_URL}/category/subcategory/${id}/${name}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        window.alert("Ocurrió un error al actualizar la subcategoría: " + response.status);
        return;
      }
      SetSubcategoryUpdater((prev) => prev + 1);
      await fetchSubcategories();
      const result: Subcategory = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching subcategory: ", error);
    }
  };

  const deleteSubcategory = async (id: number) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/category/subcategory/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        return;
      }
      await fetchSubcategories();
      navigate(-1);
    } catch (error) {
      console.error("Error fetching subcategory: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (getToken) {
        const accessToken = await getToken();
        if (accessToken) {
          fetchSubcategories();
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken]);

  const exportData: SubcategoryContextType = {
    Subcategories,
    fetchSubcategories,
    fetchSubcategory,
    fetchSubcategoriesByCategoryId,
    fetchSubcategoryProducts,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    SubcategoryUpdater,
  };

  return (
    <SubcategoryContext.Provider value={exportData}>
      {children}
    </SubcategoryContext.Provider>
  );
};

export default SubcategoryContextComponent;
