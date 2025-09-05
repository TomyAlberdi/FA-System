import { SubcategoryContext } from "@/Context/Subcategory/SubcategoryContext";
import { useContext } from "react";

export const useSubcategoryContext = () => {
  const context = useContext(SubcategoryContext);
  if (!context) {
    throw new Error(
      "useSubcategoryContext must be used within a SubcategoryContextComponent"
    );
  }
  return context;
};
