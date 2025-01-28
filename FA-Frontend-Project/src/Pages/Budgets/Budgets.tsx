import { Skeleton } from "@/components/ui/skeleton";
import { useSalesContext } from "@/Context/UseSalesContext";
import { PartialBudget } from "@/hooks/SalesInterfaces";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export const Budgets = () => {
  const { fetchBudgetsByDate } = useSalesContext();
  const { toast } = useToast();

  const todayDate = new Date().toISOString().split("T")[0];
  const [CurrentDate, setCurrentDate] = useState(todayDate);

  const [Loading, setLoading] = useState(true);
  const [Budgets, setBudgets] = useState<Array<PartialBudget> | undefined>([]);

  useEffect(() => {
    setLoading(true);
    fetchBudgetsByDate(CurrentDate)
      .then((result) => {
        setBudgets(result);
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al obtener los presupuestos.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CurrentDate]);

  return Loading ? (
    <div className="flex flex-col gap-4 h-full">
      <Skeleton className="w-full h-1/6" />
      <Skeleton className="w-full h-5/6" />
    </div>
  ) : (
    <div className="flex flex-col gap-4">
      <section>
        <h1 className="text-2xl">
          Presupuestos
        </h1>
      </section>
    </div>
  );
};
