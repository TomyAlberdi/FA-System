import { BudgetsByMonth } from "@/Pages/Sales/charts/BudgetsByMonth";
import { LastRecords } from "@/Pages/Sales/charts/LastRecords";
import { AdminPanel } from "@/Pages/Sales/AdminPanel";

export const Sales = () => {
  return (
    <div className="flex flex-col h-full w-full md:grid ProductPage">
      <BudgetsByMonth />
      <LastRecords />
      <AdminPanel />
    </div>
  );
};
