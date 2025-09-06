import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useBudgetContext } from "@/Context/Budget/UseBudgetContext";
import { PartialBudget } from "@/hooks/SalesInterfaces";
import { cn } from "@/lib/utils";
import { BudgetCard } from "@/Pages/Budgets/BudgetCard";
import { format, subDays } from "date-fns";
import { AlertCircle, CalendarIcon, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Link } from "react-router-dom";

export const Budgets = () => {
  const { fetchBudgetsByDateRange } = useBudgetContext();

  const [Dates, setDates] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const [Loading, setLoading] = useState(true);
  const [Budgets, setBudgets] = useState<Array<PartialBudget> | undefined>([]);

  useEffect(() => {
    setLoading(true);
    const fromDate = Dates.from || new Date();
    const toDate = Dates.to || new Date();

    const formattedFromDate = format(fromDate, "yyyy-MM-dd");
    const formattedToDate = format(toDate, "yyyy-MM-dd");
    fetchBudgetsByDateRange(formattedFromDate, formattedToDate)
      .then((result) => {
        setBudgets(result);
      })
      .catch(() => {
        window.alert("Ocurrió un error al obtener los presupuestos.");
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Dates]);

  return Loading ? (
    <div className="flex flex-col md:gap-4 gap-2 h-full">
      <Skeleton className="w-full h-1/6" />
      <Skeleton className="w-full h-5/6" />
    </div>
  ) : (
    <div className="flex flex-col gap-4">
      <section className="flex md:flex-row flex-col justify-between items-start md:gap-0 gap-4">
        <div className="flex flex-col gap-2 md:w-auto w-full">
          <h1 className="sectionTitle text-3xl">Presupuestos</h1>
          <Popover>
            <PopoverTrigger asChild className="md:w-auto w-full">
              <Button
                variant="outline"
                className={cn(
                  "md:w-[300px] w-full justify-start text-left font-normal",
                  !Dates && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {Dates?.from ? (
                  Dates.to ? (
                    <>
                      {format(Dates.from, "LLL dd, y")} -{" "}
                      {format(Dates.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(Dates.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto " align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={Dates?.from}
                selected={Dates}
                onSelect={(range) => {
                  if (range) {
                    setDates(range ?? { from: new Date(), to: new Date() });
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="md:w-auto w-full">
          <Button asChild className="md:w-auto w-full">
            <Link to="/sales/budgets/add">
              <PlusCircle />
              Crear presupuesto
            </Link>
          </Button>
        </div>
      </section>
      <section className="flex md:flex-row flex-col items-start justify-start md:gap-[1%]">
        {Budgets?.length === 0 ? (
          <Alert variant="destructive" className="md:w-auto w-full">
            <AlertCircle className="w-5 pt-1" />
            <AlertTitle className="text-xl">Error</AlertTitle>
            <AlertDescription className="text-lg">
              No se encontraron presupuestos en las fechas seleccionadas.
            </AlertDescription>
          </Alert>
        ) : (
          Budgets?.map((budget: PartialBudget, i) => {
            return <BudgetCard key={i} budget={budget} />;
          })
        )}
      </section>
    </div>
  );
};
