import {
  ProductContext,
  ProductContextType,
} from "@/Context/Product/ProductContext";
import {
  CompleteProduct,
  CreateProductDTO,
  Measure,
  Price,
  ReturnData,
} from "@/hooks/CatalogInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { ReactNode, useState } from "react";

interface ProductContextComponentProps {
  children: ReactNode;
}

const ProductContextComponent: React.FC<ProductContextComponentProps> = ({
  children,
}) => {
  const { getToken } = useKindeAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

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

  const createProduct = async (dto: CreateProductDTO) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/product`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) {
        console.error("Error fetching Product: ", response.statusText);
        return;
      }
      return;
    } catch (error) {
      console.error("Error fetching Product: ", error);
    }
  };

  const updateProduct = async (id: number, dto: CreateProductDTO) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/product/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) {
        console.error("Error fetching Product: ", response.statusText);
        return;
      }
      return;
    } catch (error) {
      console.error("Error fetching Product: ", error);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/product/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching Product: ", response.statusText);
        return;
      }
      return;
    } catch (error) {
      console.error("Error fetching Product: ", error);
    }
  };

  const [Measures, setMeasures] = useState<ReturnData<Measure>>({
    Loading: true,
    data: Array<Measure>(),
  });

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
        return;
      }
      const result: Array<Measure> = await response.json();
      setMeasures({ Loading: false, data: result });
    } catch (error) {
      console.error("Error fetching Measures: ", error);
      setMeasures({ Loading: false, data: [] });
    }
  };

  const [Prices, setPrices] = useState<ReturnData<Price>>({
    Loading: true,
    data: Array<Price>(),
  });

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
      const result: Array<Price> = await response.json();
      setPrices({ Loading: false, data: result });
    } catch (error) {
      console.error("Error fetching Prices: ", error);
      setPrices({ Loading: false, data: [] });
    }
  };

  const exportData: ProductContextType = {
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    Measures,
    fetchMeasures,
    Prices,
    fetchPrices,
  };

  return (
    <ProductContext.Provider value={exportData}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContextComponent;
