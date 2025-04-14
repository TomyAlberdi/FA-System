import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSalesContext } from "@/Context/UseSalesContext";
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import CalendarTable from "@/Pages/Register/CalendarTable";
import AddRegister from "@/Pages/Register/AddRegister";
import { CustomCalendar } from "@/components/ui/calendar";
import { useNavigate } from "react-router-dom";

const CashRegister = () => {
  const { RegisterTotalAmount, RegisterTypes, fetchRegisterTypes } =
    useSalesContext();
  const navigate = useNavigate();

  const [CurrentYearMonth, setCurrentYearMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [CurrentMonth, setCurrentMonth] = useState<string>("");
  const [CurrentYear, setCurrentYear] = useState<number>(0);
  const [NumericYear, setNumericYear] = useState(0);
  const [NumericMonth, setNumericMonth] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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
    fetchRegisterTypes(CurrentYearMonth);
    setNumericYear(CurrentYearMonth.split("-").map(Number)[0]);
    setNumericMonth(CurrentYearMonth.split("-").map(Number)[1] - 1);
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

  //TODO: Rework component (Use Calendar under Card and display selected day registers on the right, default today)
  return (
    <div className="h-full flex md:flex-row flex-col justify-start items-start gap-3">
      <section className="md:w-1/3 h-full">
        <Card className="w-full h-auto mb-3">
          <CardHeader>
            <CardTitle className="">Total en Caja Registradora</CardTitle>
            <span className="font-medium text-3xl">
              $ {RegisterTotalAmount}
            </span>
          </CardHeader>
          <CardContent>
            <AddRegister yearMonth={CurrentYearMonth} />
          </CardContent>
          <CardContent className="flex flex-col gap-2">
            <div className="flex gap-2 md:items-center items-start text-xl">
              <ChevronUp className="text-chart-2 large-icon" />
              <span className="font-medium">
                Ingresos {CurrentMonth}: <br className="block md:hidden" />
                <span className="text-chart-2">$ {RegisterTypes[0]}</span>
              </span>
            </div>
            <div className="flex gap-2 md:items-center items-start text-xl">
              <ChevronDown className="text-destructive large-icon" />
              <span className="font-medium">
                Gastos {CurrentMonth}: <br className="block md:hidden" />
                <span className="text-destructive">$ {RegisterTypes[1]}</span>
              </span>
            </div>
          </CardContent>
        </Card>
        <div className="w-full h-auto">
          <CustomCalendar
            className="rounded-md border"
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                setSelectedDate(date);
                // Handle your date selection logic here
                console.log(date);
              }
            }}
          />
        </div>
      </section>
{/*       <div className="w-2/3 h-full flex-col justify-start items-center hidden md:flex">
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
        <CalendarTable year={NumericYear} month={NumericMonth} />
      </div> */}
    </div>
  );
};
export default CashRegister;
