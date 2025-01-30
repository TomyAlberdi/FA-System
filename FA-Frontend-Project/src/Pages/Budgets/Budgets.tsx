import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useSalesContext } from "@/Context/UseSalesContext";
import { PartialBudget } from "@/hooks/SalesInterfaces";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { BudgetCard } from "@/Pages/Budgets/BudgetCard";

export const Budgets = () => {
  const { fetchBudgetsByDateRange } = useSalesContext();
  const { toast } = useToast();

  const [Dates, setDates] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const [Loading, setLoading] = useState(true);
  const [Budgets, setBudgets] = useState<Array<PartialBudget> | undefined>([]);

  useEffect(() => {
    setLoading(true);
    const formattedFromDate = format(Dates.from!, "yyyy-MM-dd");
    const formattedToDate = format(Dates.to!, "yyyy-MM-dd");
    console.log(formattedFromDate, " ", formattedToDate);
    fetchBudgetsByDateRange(formattedFromDate, formattedToDate)
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
  }, [Dates]);

  return Loading ? (
    <div className="flex flex-col gap-4 h-full">
      <Skeleton className="w-full h-1/6" />
      <Skeleton className="w-full h-5/6" />
    </div>
  ) : (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-2">
        <h1 className="sectionTitle">Presupuestos</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[300px] justify-start text-left font-normal",
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
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={Dates?.from}
              selected={Dates}
              onSelect={(range) =>
                setDates(range ?? { from: new Date(), to: new Date() })
              }
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </section>
      <section className="listBody">
        {Budgets?.map((budget: PartialBudget, i) => {
          return <BudgetCard key={i} budget={budget} />;
        })}
      </section>
    </div>
  );
};
