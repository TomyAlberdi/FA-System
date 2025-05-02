import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSalesContext } from "@/Context/UseSalesContext";
import { RegisterRecord } from "@/hooks/SalesInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { AlertCircle, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DailyCashRegister = () => {
  const { BASE_URL, fetchRegisterTotalAmount, FormattedDate } =
    useSalesContext();
  const { getToken } = useKindeAuth();
  const navigate = useNavigate();

  const [DailyTypes, setDailyTypes] = useState<Array<number>>([0, 0]);
  const [DailyTotal, setDailyTotal] = useState<number>(0);

  const [Records, setRecords] = useState<Array<RegisterRecord> | undefined>([]);
  const [Reload, setReload] = useState(false);

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  const fetchRecords = async () => {
    let fetchDate = FormattedDate;
    if (!fetchDate) {
      const date = new Date();
      fetchDate = formatDate(date);
    }
    const url = `${BASE_URL}/cash-register/${fetchDate}`;
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching cash register: ", response.statusText);
        return;
      }
      const result: Array<RegisterRecord> = await response.json();
      setRecords(result);
      getDailyTypes(result);
    } catch (error) {
      console.error("Error fetching cash register: ", error);
    }
  };

  const onDeletePress = (id: number) => {
    if (window.confirm("¿Desea eliminar el registro?")) {
      handleDeleteRecord(id);
    }
  };

  const handleDeleteRecord = async (id: number) => {
    const url = `${BASE_URL}/cash-register/${id}`;
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error deleting record: ", response.statusText);
        window.alert(`Error eliminando el registro: ${response.status}`);
        return;
      }
      window.alert("El registro ha sido eliminado con éxito.");
      setReload(!Reload);
      await fetchRegisterTotalAmount();
    } catch (error) {
      console.error("Error deleting record: ", error);
      window.alert("Ocurrió un error al eliminar el registro.");
    }
  };

  const getDailyTypes = (records: Array<RegisterRecord>) => {
    let ingresos = 0;
    let gastos = 0;
    records?.forEach((record) => {
      if (record.type === "INGRESO") {
        ingresos += record.amount;
      } else {
        gastos += record.amount;
      }
    });
    setDailyTypes([ingresos, gastos]);
    setDailyTotal(Number((ingresos - gastos).toFixed(2)));
  };

  const handleNavigateToBudget = (detail: string) => {
    if (detail.startsWith("PRESUPUESTO")) {
      const id = detail.split(" ")[1];
      navigate(`/sales/budgets/${id}`);
    }
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FormattedDate, Reload]);

  return (
    <>
      <Card className="w-full h-auto">
        <CardHeader>
          <CardTitle>Caja del día {FormattedDate}:</CardTitle>
          <span className="font-medium text-3xl">$ {DailyTotal}</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex gap-2 items-center text-xl">
            <ChevronUp className="text-chart-2 large-icon" />
            <span className="font-medium">
              Ingresos: <span className="text-chart-2">$ {DailyTypes[0]}</span>
            </span>
          </div>
          <div className="flex gap-2 items-center text-xl">
            <ChevronDown className="text-destructive large-icon" />
            <span className="font-medium">
              Gastos:{" "}
              <span className="text-destructive">$ {DailyTypes[1]}</span>
            </span>
          </div>
        </CardContent>
      </Card>
      {Records && Records?.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/12">Tipo</TableHead>
              <TableHead className="w-3/12">Cantidad</TableHead>
              <TableHead className="w-7/12">Detalle</TableHead>
              <TableHead className="w-1/12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Records?.map((record, index) => (
              <TableRow
                key={index}
                className="cursor-pointer"
                onClick={() => handleNavigateToBudget(record.detail)}
              >
                <TableCell>
                  {record.type === "INGRESO" ? (
                    <ChevronUp className="text-chart-2 large-icon" />
                  ) : (
                    <ChevronDown className="text-destructive large-icon" />
                  )}
                </TableCell>
                <TableCell>
                  {record.type === "GASTO" && "- "} $ {record.amount}
                </TableCell>
                <TableCell>{record.detail}</TableCell>
                <TableCell>
                  <Button onClick={() => onDeletePress(record.id as number)}>
                    <Trash2 className="bigger-icon" color="red" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>
            Lista de los registros del día {FormattedDate}
          </TableCaption>
        </Table>
      ) : (
        <Alert variant="destructive" className="w-auto">
          <AlertCircle className="w-5 pt-1" />
          <AlertTitle className="text-xl">Error</AlertTitle>
          <AlertDescription className="text-lg">
            La fecha no tiene registros asociados.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
export default DailyCashRegister;
