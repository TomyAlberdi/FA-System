import { BudgetContext } from "@/Context/Budget/BudgetContext";
import { useContext } from "react";

export const useBudgetContext = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error(
      "useBudgetContext must be used within a BudgetContextComponent"
    );
  }
  return context;
};
