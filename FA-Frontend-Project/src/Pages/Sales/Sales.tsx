import { BudgetsByMonth } from "@/Pages/Sales/charts/BudgetsByMonth";
import { LastRecords } from "@/Pages/Sales/charts/LastRecords";
import { AdminPanel } from "@/Pages/Sales/AdminPanel";

export const Sales = () => {
  return (
    <div className="Saes h-full w-full grid ProductPage">
      <BudgetsByMonth />
      <LastRecords />
      <AdminPanel />
    </div>
  );
};
