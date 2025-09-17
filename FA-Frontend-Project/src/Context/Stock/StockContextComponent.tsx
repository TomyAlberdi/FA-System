import { StockContext, StockContextType } from "@/Context/Stock/StockContext";
import { ProductStock, StockChangeType } from "@/hooks/CatalogInterfaces";
// removed getToken-based auth
import { ReactNode, useState } from "react";

interface StockContextComponentProps {
  children: ReactNode;
}

const StockContextComponent: React.FC<StockContextComponentProps> = ({
  children,
}) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchStockByProduct = async (id: number) => {
      try {
      const response = await fetch(`${BASE_URL}/stock/${id}`);
      if (!response.ok) {
        console.error("Error fetching Product Stock: ", response.statusText);
        window.alert("Ocurrió un error al obtener el stock del producto: " + response.status);
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
      const response = await fetch(
        `${BASE_URL}/stock?keyword=${keyword}&page=${page}&size=${size}`
      );
      if (!response.ok) {
        console.error("Error fetching Product Stock: ", response.statusText);
        window.alert("Ocurrió un error al obtener el stock del producto: " + response.status);
        return;
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Product Stock: ", error);
    }
  };

  const [StockUpdater, setStockUpdater] = useState(0);

  const changeStock = async (
    id: number,
    quantity: number,
    type: StockChangeType
  ) => {
    try {
      const response = await fetch(
        `${BASE_URL}/stock/${type}?` +
          new URLSearchParams({
            productId: id.toString(),
            quantity: quantity.toString(),
          }).toString(),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        console.error("Error fetching Product Stock: ", response.statusText);
        window.alert("Ocurrió un error al actualizar el stock del producto: " + response.status);
        return;
      }
      window.alert("Stock actualizado con éxito.");
      setStockUpdater((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching Product Stock: ", error);
    }
  };

  const exportData: StockContextType = {
    fetchStockByProduct,
    fetchStocks,
    changeStock,
    StockUpdater,
  };

  return (
    <StockContext.Provider value={exportData}>{children}</StockContext.Provider>
  );
};

export default StockContextComponent;
