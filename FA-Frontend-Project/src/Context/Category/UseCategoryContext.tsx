import { CategoryContext } from "@/Context/Category/CategoryContext";
import { useContext } from "react";

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategoryContext must be used within a CategoryContextComponent");
  }
  return context;
};