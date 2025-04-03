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
import { ToastAction } from "@/components/ui/toast";
import { useSalesContext } from "@/Context/UseSalesContext";
import { RegisterRecord } from "@/hooks/SalesInterfaces";
import { useToast } from "@/hooks/use-toast";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { AlertCircle, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DailyCashRegister = () => {
  const { date } = useParams();
  const { BASE_URL, fetchRegisterTotalAmount } = useSalesContext();
  const { getToken } = useKindeAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [Records, setRecords] = useState<Array<RegisterRecord> | undefined>([]);
  const [DailyTypes, setDailyTypes] = useState<Array<number>>([0, 0]);
  const [DailyTotal, setDailyTotal] = useState<number>(0);

  const onDeletePress = (id: number) => {
    toast({
      variant: "destructive",
      title: "Confirmación",
      description: "¿Desea eliminar el registro?",
      action: (
        <ToastAction
          altText="Eliminar"
          onClick={() => handleDeleteRegister(id)}
        >
          Desactivar
        </ToastAction>
      ),
    });
  };

  const handleDeleteRegister = async (id: number) => {
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
        console.error("Error deleting register: ", response.statusText);
        return;
      }
      toast({
        title: "Registro eliminado",
        description: "El registro ha sido eliminado con éxito.",
      });
      fetchRegisterTotalAmount();
    } catch (error) {
      console.error("Error deleting register: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al eliminar el registro.",
      });
    }
  };

  useEffect(() => {
    const fetchTotal = async () => {
      const url = `${BASE_URL}/cash-register/${date}`;
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
      } catch (error) {
        console.error("Error fetching cash register: ", error);
      }
    };
    fetchTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, handleDeleteRegister]);

  useEffect(() => {
    let ingresos = 0;
    let gastos = 0;
    Records?.forEach((record) => {
      if (record.type === "INGRESO") {
        ingresos += record.amount;
      } else {
        gastos += record.amount;
      }
    });
    setDailyTypes([ingresos, gastos]);
    setDailyTotal(Number((ingresos - gastos).toFixed(2)));
  }, [Records]);

  const handleNavigateToBudget = (detail: string) => {
    if (detail.startsWith("PRESUPUESTO")) {
      const id = detail.split(" ")[1];
      navigate(`/sales/budgets/${id}`);
    }
  };

  return (
    <div className="h-full flex justify-center items-start gap-3">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Caja del día {date}:</CardTitle>
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
      <div className="w-2/3">
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
                <TableRow key={index}>
                  <TableCell
                    className={
                      "font-medium " +
                      (record.type === "INGRESO"
                        ? "text-chart-2"
                        : "text-destructive")
                    }
                  >
                    {record.type === "INGRESO" ? "INGRESO" : "GASTO"}
                  </TableCell>
                  <TableCell>
                    {record.type === "GASTO" && "- "} $ {record.amount}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => handleNavigateToBudget(record.detail)}
                  >
                    {record.detail}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => onDeletePress(record.id as number)}>
                      <Trash2 className="bigger-icon" color="red" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>Lista de los registros del día {date}</TableCaption>
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
      </div>
    </div>
  );
};
export default DailyCashRegister;
