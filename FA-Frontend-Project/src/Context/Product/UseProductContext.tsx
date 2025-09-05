import { ProductContext } from "@/Context/Product/ProductContext";
import { useContext } from "react";

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductContextComponent");
  }
  return context;
};