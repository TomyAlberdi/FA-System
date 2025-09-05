import { CatalogContext } from "@/Context/CatalogContext";
import { useContext } from "react";

export const useCatalogContext = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useCatalogContext must be used within a CatalogContextComponent");
  }
  return context;
};