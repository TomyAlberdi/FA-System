import { StockContext } from "@/Context/Stock/StockContext";
import { useContext } from "react";

export const useStockContext = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error("useStockContext must be used within a StockContextComponent");
  }
  return context;
};