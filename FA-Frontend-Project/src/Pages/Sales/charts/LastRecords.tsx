import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const LastRecords = () => {
  const { BASE_URL } = useSalesContext();
  const { getToken } = useKindeAuth();
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(true);
  const [Data, setData] = useState<Array<RegisterRecord>>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!getToken) {
          console.error("getToken is undefined");
          return;
        }
        const accessToken = await getToken();
        fetch(`${BASE_URL}/cash-register/last`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setData(data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          })
          .finally(() => setLoading(false));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavigateToBudget = (detail: string) => {
    if (detail.startsWith("PRESUPUESTO")) {
      const id = detail.split(" ")[1];
      navigate(`/sales/budgets/${id}`);
    }
  };

  if (Loading) {
    return (
      <Skeleton className="col-start-9 col-span-7 row-start-1 row-end-16" />
    );
  } else if (Data?.length === 0) {
    return (
      <Card className="col-start-9 col-span-7 row-start-1 row-end-16 border border-input flex flex-col items-center justify-center text-center">
        <CardHeader className="items-center pb-0">
          <CardTitle>No hay registros disponibles</CardTitle>
        </CardHeader>
      </Card>
    );
  } else {
    return (
      <Card className="col-start-9 col-span-7 row-start-1 row-end-16 flex flex-col">
        <CardHeader className="items-center pb-2 text-center">
          <CardTitle>Últimos Registros en Caja</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0 w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/5">Tipo</TableHead>
                <TableHead className="md:w-1/5 w-2/5">Monto</TableHead>
                <TableHead className="w-1/5 hidden md:table-cell">Fecha</TableHead>
                <TableHead className="w-2/5">Detalle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(Data) &&
                Data?.map((record: RegisterRecord, index: number) => {
                  return (
                    <TableRow
                      key={index}
                      className="cursor-pointer"
                      onClick={() => handleNavigateToBudget(record.detail)}
                    >
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
                      <TableCell className="hidden md:table-cell">{record.date}</TableCell>
                      <TableCell>
                        {record.detail
                          ? record.detail
                          : "No hay detalle disponible"}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
            <TableCaption className="text-center">
              Últimos Registros en Caja
            </TableCaption>
          </Table>
        </CardContent>
      </Card>
    );
  }
};
