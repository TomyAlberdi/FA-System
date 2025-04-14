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
import { useToast } from "@/hooks/use-toast";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { AlertCircle, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DailyCashRegister = () => {
  const {
    BASE_URL,
    fetchRegisterTotalAmount,
    FormattedDate,
    fetchRecords,
    Records,
  } = useSalesContext();
  const { getToken } = useKindeAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [DailyTypes, setDailyTypes] = useState<Array<number>>([0, 0]);
  const [DailyTotal, setDailyTotal] = useState<number>(0);

  const onDeletePress = (id: number) => {
    toast({
      variant: "destructive",
      title: "Confirmación",
      description: "¿Desea eliminar el registro?",
      action: (
        <ToastAction altText="Eliminar" onClick={() => handleDeleteRecord(id)}>
          Eliminar
        </ToastAction>
      ),
    });
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
        return;
      }
      toast({
        title: "Registro eliminado",
        description: "El registro ha sido eliminado con éxito.",
      });
      fetchRegisterTotalAmount();
      fetchRecords();
    } catch (error) {
      console.error("Error deleting record: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al eliminar el registro.",
      });
    }
  };

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
