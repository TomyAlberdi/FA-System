import { CatalogContext, CatalogContextType } from "@/Context/CatalogContext";
import { ReactNode } from "react";
import {
  Category,
  CompleteProduct,
  Measure,
  Price,
  ProductStock,
  Provider, Subcategory
} from "@/hooks/CatalogInterfaces";
import { useToast } from "@/hooks/use-toast";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

interface CatalogContextComponentProps {
  children: ReactNode;
}

const CatalogContextComponent: React.FC<CatalogContextComponentProps> = ({
  children,
}) => {
  const { toast } = useToast();

  const BASE_URL = "http://18.228.211.5:8081";

  const { getToken } = useKindeAuth();

  /// CATEGORY GET /////

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
      return result;
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchCategory = async (id: number) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/category/${id}`, {
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

  const fetchCategoryProducts = async (id: number, page: number, size: number) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/category/${id}/products?page=${page}&size=${size}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching Category: ", response.statusText);
        toast({
          variant: "destructive",
          title: `Error ${response.status}`,
          description: `Ocurrió un error al obtener los productos de la categoría.`,
        });
        return;
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Provider: ", error);
    }
  };

  /// SUBCATEGORY GET /////

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
      }
      const result: Array<Subcategory> = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching subcategories: ", error);
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
        return;
      }
      const result: Array<Subcategory> = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching subcategories: ", error);
    }
  };

  const fetchSubcategoryById = async (id: number) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/category/subcategory/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        return;
      }
      const result: Subcategory = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching subcategory: ", error);
    }
  };

  const fetchSubcategoryProducts = async (id: number, page: number, size: number) => {
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
        return;
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching subcategory products: ", error);
    }
  };

  /// PROVIDER GET /////

  const fetchProviders = async () => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/provider`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        return;
      }
      const result: Array<Provider> = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchProvider = async (id: number) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/provider/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching Provider: ", response.statusText);
        toast({
          variant: "destructive",
          title: `Error ${response.status}`,
          description: `Ocurrió un error al obtener el proveedor.`,
        });
        return;
      }
      const result: Provider = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Provider: ", error);
    }
  };

  const fetchProviderProducts = async (id: number, page: number, size: number) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/provider/${id}/products?page=${page}&size=${size}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error(
          "Error fetching Provider products: ",
          response.statusText
        );
        toast({
          variant: "destructive",
          title: `Error ${response.status}`,
          description: `Ocurrió un error al obtener los productos del proveedor.`,
        });
        return;
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Provider products: ", error);
    }
  };

  /// MEASURE GET /////

  const fetchMeasures = async () => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/filter/measures`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching Measures: ", response.statusText);
        toast({
          variant: "destructive",
          title: `Error ${response.status}`,
          description: `Ocurrió un error al obtener los productos de la categoría.`,
        });
        return;
      }
      const result: Array<Measure> = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Measures: ", error);
    }
  };

  /// PRICES GET /////

  const fetchPrices = async () => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/filter/prices`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching Prices: ", response.statusText);
        return;
      }
      const result: Price = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Prices: ", error);
    }
  };

  /// PRODUCT GET /////

  const fetchProduct = async (id: number) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/product/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching Product: ", response.statusText);
        return;
      }
      const result: CompleteProduct = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Product: ", error);
    }
  };

  /// STOCK GET /////

  const fetchProductStock = async (id: number) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/stock/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching Product Stock: ", response.statusText);
        return;
      }
      const result: ProductStock = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Product Stock: ", error);
    }
  };

  const fetchStockListByKeyword = async (
    keyword: string,
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
        `${BASE_URL}/stock?keyword=${keyword}&page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        console.error("Error fetching Product Stock: ", response.statusText);
        return;
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Product Stock: ", error);
    }
  };

  /// EXPORT DATA /////

  const exportData: CatalogContextType = {
    BASE_URL,
    fetchCategories,
    fetchCategory,
    fetchCategoryProducts,
    fetchSubcategoriesByCategoryId,
    fetchSubcategories,
    fetchSubcategoryById,
    fetchSubcategoryProducts,
    fetchProviders,
    fetchProvider,
    fetchProviderProducts,
    fetchMeasures,
    fetchPrices,
    fetchProduct,
    fetchProductStock,
    fetchStockListByKeyword,
  };

  return (
    <CatalogContext.Provider value={exportData}>
      {children}
    </CatalogContext.Provider>
  );
};

export default CatalogContextComponent;
