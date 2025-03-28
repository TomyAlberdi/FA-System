import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSalesContext } from "@/Context/UseSalesContext";
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp
} from "lucide-react";
import { useEffect, useState } from "react";
import CalendarTable from "@/Pages/Register/CalendarTable";
import AddRegister from "@/Pages/Register/AddRegister";

const CashRegister = () => {
  const { RegisterTotalAmount, fetchRegisterTypes } = useSalesContext();

  const [RegisterTypes, setRegisterTypes] = useState<Array<number>>([0, 0]);
  const [CurrentYearMonth, setCurrentYearMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [CurrentMonth, setCurrentMonth] = useState<string>("");
  const [CurrentYear, setCurrentYear] = useState<number>(0);

  useEffect(() => {
    const [year, month] = CurrentYearMonth.split("-").map(Number);
    const date = new Date(year, month - 1); // month - 1 because Date months are 0-based
    const currentMonth = new Intl.DateTimeFormat("es-ES", {
      month: "long",
    }).format(date);
    setCurrentMonth(
      currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)
    );
    setCurrentYear(year);
    fetchRegisterTypes(CurrentYearMonth).then((result) => {
      if (result) {
        setRegisterTypes(result);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CurrentYearMonth]);

  const nextYearMonth = () => {
    const [year, month] = CurrentYearMonth.split("-").map(Number);
    const nextMonth = month + 1;
    const nextYear = nextMonth > 12 ? year + 1 : year;
    const adjustedMonth = nextMonth > 12 ? 1 : nextMonth;
    const formattedMonth = adjustedMonth.toString().padStart(2, "0");
    setCurrentYearMonth(`${nextYear}-${formattedMonth}`);
  };

  const previousYearMonth = () => {
    const [year, month] = CurrentYearMonth.split("-").map(Number);
    const prevMonth = month - 1;
    const prevYear = prevMonth < 1 ? year - 1 : year;
    const adjustedMonth = prevMonth < 1 ? 12 : prevMonth;
    const formattedMonth = adjustedMonth.toString().padStart(2, "0");
    setCurrentYearMonth(`${prevYear}-${formattedMonth}`);
  };

  return (
    <div className="h-full flex justify-center items-start gap-3">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Total en Caja Registradora</CardTitle>
          <span className="font-medium text-3xl">$ {RegisterTotalAmount}</span>
        </CardHeader>
        <CardContent>
          <AddRegister />
        </CardContent>
        <CardContent className="flex flex-col gap-2">
          <div className="flex gap-2 items-center text-xl">
            <ChevronUp className="text-chart-2 large-icon" />
            <span className="font-medium">
              Ingresos {CurrentMonth}:{" "}
              <span className="text-chart-2">$ {RegisterTypes[0]}</span>
            </span>
          </div>
          <div className="flex gap-2 items-center text-xl">
            <ChevronDown className="text-chart-5 large-icon" />
            <span className="font-medium">
              Gastos {CurrentMonth}:{" "}
              <span className="text-chart-5">$ {RegisterTypes[1]}</span>
            </span>
          </div>
        </CardContent>
      </Card>
      <div className="w-2/3 h-full flex flex-col justify-start items-center">
        <section className="w-full flex justify-between gap-4">
          <Button onClick={previousYearMonth}>
            <ChevronsLeft className="large-icon" />
          </Button>
          <h2 className="text-3xl font-semibold mb-4">
            Registros {CurrentMonth} {CurrentYear}
          </h2>
          <Button onClick={nextYearMonth}>
            <ChevronsRight className="large-icon" />
          </Button>
        </section>
        <CalendarTable
          year={CurrentYearMonth.split("-").map(Number)[0]}
          month={CurrentYearMonth.split("-").map(Number)[1] - 1}
        />
      </div>
    </div>
  );
};
export default CashRegister;
