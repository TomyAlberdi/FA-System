import { BudgetsByMonth } from "@/Pages/Sales/charts/BudgetsByMonth";
import { LastRecords } from "@/Pages/Sales/charts/LastRecords";
import { AdminPanel } from "@/Pages/Sales/AdminPanel";

//TODO: Mobile sales charts
export const Sales = () => {
  return (
    <div className="h-full w-full grid ProductPage">
      <BudgetsByMonth />
      <LastRecords />
      <AdminPanel />
    </div>
  );
};
