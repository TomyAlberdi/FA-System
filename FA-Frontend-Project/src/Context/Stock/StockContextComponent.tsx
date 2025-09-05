import { StockContext, StockContextType } from "@/Context/Stock/StockContext";
import { ProductStock, StockChangeType } from "@/hooks/CatalogInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { ReactNode } from "react";

interface StockContextComponentProps {
  children: ReactNode;
}

const StockContextComponent: React.FC<StockContextComponentProps> = ({
  children,
}) => {
  const { getToken } = useKindeAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchStockByProduct = async (id: number) => {
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

  const fetchStocks = async (keyword: string, page: number, size: number) => {
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

  const changeStock = async (
    id: number,
    quantity: number,
    type: StockChangeType
  ) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(
        `${BASE_URL}/stock/${type}?` +
          new URLSearchParams({
            productId: id.toString(),
            quantity: quantity.toString(),
          }).toString(),
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        console.error("Error fetching Product Stock: ", response.statusText);
        return;
      }
      return;
    } catch (error) {
      console.error("Error fetching Product Stock: ", error);
    }
  };

  const exportData: StockContextType = {
    fetchStockByProduct,
    fetchStocks,
    changeStock,
  };

  return (
    <StockContext.Provider value={exportData}>{children}</StockContext.Provider>
  );
};

export default StockContextComponent;
