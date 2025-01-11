import { useContext } from "react";
import { SalesContext } from "@/Context/SalesContext";

export const useSalesContext = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error(
      "useSalesContext must be used within a SalesContextComponent"
    );
  }
  return context;
};
