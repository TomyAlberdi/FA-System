import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSalesContext } from "@/Context/UseSalesContext";
import { ChevronDown, ChevronUp, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import CalendarTable from "@/Pages/Register/CalendarTable";

const CashRegister = () => {
  const { fetchTotalAmount, fetchRegisterTypes } = useSalesContext();

  const [Total, setTotal] = useState<number | undefined>(undefined);
  const [RegisterTypes, setRegisterTypes] = useState<Array<number>>([0, 0]);
  const [CurrentYearMonth, setCurrentYearMonth] = useState<string>("");
  const [CurrentMonth, setCurrentMonth] = useState<string>("");
  const [CurrentYear, setCurrentYear] = useState<number>(0);

  useEffect(() => {
    fetchTotalAmount().then((result) => {
      setTotal(result);
    });
    fetchRegisterTypes().then((result) => {
      setRegisterTypes(result);
    });
    setCurrentYearMonth(new Date().toISOString().slice(0, 7));
    const currentMonth = new Intl.DateTimeFormat("es-ES", {
      month: "long",
    }).format(new Date());
    setCurrentMonth(
      currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)
    );
    setCurrentYear(new Date().getFullYear());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CurrentYearMonth]);

  return (
    <div className="h-full flex justify-center items-start gap-3">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Total en Caja Registradora</CardTitle>
          <span className="font-medium text-3xl">$ {Total}</span>
        </CardHeader>
        <CardContent>
          <Button className="w-full text-lg">
            <DollarSign className="big-icon" />
            Modificar
          </Button>
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
        <h2 className="text-3xl font-semibold mb-4">
          Registros {CurrentMonth} {CurrentYear}
        </h2>
        <CalendarTable
          year={CurrentYearMonth.split("-").map(Number)[0]}
          month={CurrentYearMonth.split("-").map(Number)[1] - 1}
        />
      </div>
    </div>
  );
};
export default CashRegister;
