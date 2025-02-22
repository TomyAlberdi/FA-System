import { BudgetsByMonth } from "@/Pages/Sales/charts/BudgetsByMonth";
import { LastBudgets } from "@/Pages/Sales/charts/LastBudgets";
import { AdminPanel } from "@/Pages/Sales/AdminPanel";

export const Sales = () => {
  return (
    <div className="Saes h-full w-full ProductPage">
      <BudgetsByMonth />
      <LastBudgets />
      <AdminPanel />
    </div>
  );
};
