import { BudgetsByMonth } from "@/Pages/Sales/charts/BudgetsByMonth";
import { LastBudgets } from "@/Pages/Sales/charts/LastBudgets";

export const Sales = () => {
  return (
    <div className="Saes h-full w-full ProductPage">
      <BudgetsByMonth />
      <LastBudgets />
    </div>
  );
};
