import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSalesContext } from "@/Context/UseSalesContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import AddRegister from "@/Pages/Register/AddRegister";
import { CustomCalendar } from "@/components/ui/calendar";
import DailyCashRegister from "@/Pages/Register/DailyCashRegister";

const CashRegister = () => {
  const {
    RegisterTotalAmount,
    RegisterTypes,
    fetchRegisterTypes,
    setFormattedDate,
  } = useSalesContext();

  // Calendar display and functionality
  const [CurrentYearMonth, setCurrentYearMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [CurrentMonth, setCurrentMonth] = useState<string>("");

  const formatMonth = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", { month: "long" })
      .format(date)
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  const formatYearMonth = (year: number, month: number) => {
    return `${year}-${month.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const [year, month] = CurrentYearMonth.split("-").map(Number);
    const date = new Date(year, month - 1);
    setCurrentMonth(formatMonth(date));
    fetchRegisterTypes(CurrentYearMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CurrentYearMonth]);

  const updateYearMonth = (increment: number) => {
    const [year, month] = CurrentYearMonth.split("-").map(Number);
    const newMonth = month + increment;
    const newYear = year + Math.floor((newMonth - 1) / 12);
    const adjustedMonth = ((newMonth - 1 + 12) % 12) + 1;
    setCurrentYearMonth(formatYearMonth(newYear, adjustedMonth));
  };

  const nextYearMonth = () => updateYearMonth(1);
  const previousYearMonth = () => updateYearMonth(-1);

  // Records API request
  const [SelectedDate, setSelectedDate] = useState(new Date());
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };
  useEffect(() => {
    if (SelectedDate) {
      setFormattedDate(formatDate(SelectedDate));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SelectedDate]);

  return (
    <div className="h-full flex md:flex-row flex-col justify-start items-start gap-3">
      <section className="md:w-1/3 h-full w-full">
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
            selected={SelectedDate}
            onSelect={(date) => {
              setSelectedDate(date ?? new Date());
            }}
            disabled={(date) => date > new Date()}
            onNextMonth={nextYearMonth}
            onPrevMonth={previousYearMonth}
            currentYearMonth={CurrentYearMonth}
          />
        </div>
      </section>
      <section className="md:w-2/3 w-full h-full flex flex-col gap-3">
        <DailyCashRegister />
      </section>
    </div>
  );
};
export default CashRegister;
