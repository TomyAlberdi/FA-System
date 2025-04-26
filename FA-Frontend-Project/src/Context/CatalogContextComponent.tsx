import { CatalogContext, CatalogContextType } from "@/Context/CatalogContext";
import { ReactNode, useEffect, useState } from "react";
import {
  Category,
  CompleteProduct,
  Measure,
  Price,
  ProductStock,
  Provider,
  ReturnData,
  Subcategory,
} from "@/hooks/CatalogInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

interface CatalogContextComponentProps {
  children: ReactNode;
}

const CatalogContextComponent: React.FC<CatalogContextComponentProps> = ({
  children,
}) => {
  const { getToken } = useKindeAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      if (getToken) {
        const accessToken = await getToken();
        if (accessToken) {
          fetchCategories();
          fetchProviders();
          fetchMeasures();
          fetchPrices();
          fetchSubcategories();
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken]);

  /// CATEGORY GET /////

  const [Categories, setCategories] = useState<ReturnData>({
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

  /// SUBCATEGORY GET /////

  const [Subcategories, setSubcategories] = useState<Array<Subcategory>>([]);

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
      setSubcategories(result);
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
        return;
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching subcategory products: ", error);
    }
  };

  /// PROVIDER GET /////

  const [Providers, setProviders] = useState<ReturnData>({
    Loading: true,
    data: Array<Provider>(),
  });

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
      setProviders({ Loading: false, data: result });
    } catch (error) {
      console.error("Error fetching data: ", error);
      setProviders({ Loading: false, data: [] });
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
        window.alert(`Error obteniendo el proveedor: ${response.status}`);
        return;
      }
      const result: Provider = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Provider: ", error);
    }
  };

  const fetchProviderProducts = async (
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
        `${BASE_URL}/provider/${id}/products?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        console.error(
          "Error fetching Provider products: ",
          response.statusText
        );
        window.alert(
          `Error obteniendo los productos del proveedor: ${response.status}`
        );
        return;
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Provider products: ", error);
    }
  };

  /// MEASURE GET /////

  const [Measures, setMeasures] = useState<Array<Measure>>([]);

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
        window.alert(
          `Error obteniendo los productos de la categoría: ${response.status}`
        );
        return;
      }
      const result: Array<Measure> = await response.json();
      setMeasures(result);
    } catch (error) {
      console.error("Error fetching Measures: ", error);
    }
  };

  /// PRICES GET /////

  const [Prices, setPrices] = useState<Price>();

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
      setPrices(result);
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

  const exportData: CatalogContextType = {
    BASE_URL,
    // Categories
    Categories,
    fetchCategories,
    fetchCategory,
    fetchCategoryProducts,
    // Subcategories
    fetchSubcategoriesByCategoryId,
    Subcategories,
    fetchSubcategories,
    fetchSubcategoryById,
    fetchSubcategoryProducts,
    // Providers
    Providers,
    fetchProviders,
    fetchProvider,
    fetchProviderProducts,
    // Product filters
    Measures,
    fetchMeasures,
    Prices,
    fetchPrices,
    // Product
    fetchProduct,
    // Stock
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
