import { useSalesContext } from "@/Context/UseSalesContext";
import { CompleteBudget } from "@/hooks/SalesInterfaces";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const ClientBudgets = () => {
  const { id } = useParams();
  const { fetchBudgetsByClient } = useSalesContext();

  const [Budgets, setBudgets] = useState<Array<CompleteBudget> | undefined>([]);

  useEffect(() => {
    if (id) {
      fetchBudgetsByClient(Number.parseInt(id)).then((result) => {
        setBudgets(result);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="CatalogPageList w-2/3">
      <h1 className="text-xl text-muted-foreground text-left pb-5">
        Lista de Presupuestos
      </h1>
    </div>
  );
};
