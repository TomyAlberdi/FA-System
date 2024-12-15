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
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { StockRecordInfo } from "@/hooks/CatalogInterfaces";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

export const LastStockRecords = () => {
  const { BASE_URL } = useCatalogContext();
  const { getToken } = useKindeAuth();
  const [Loading, setLoading] = useState(true);
  const [Data, setData] = useState<Array<StockRecordInfo>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!getToken) {
          console.error("getToken is undefined");
          return;
        }
        const accessToken = await getToken();
        fetch(`${BASE_URL}/stock/lastRecords`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((response) => response.json())
          .then((data: Array<StockRecordInfo>) => {
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

  const formatDateTime = (input: string) => {
    const parsedDate = new Date(input);
    if (isNaN(parsedDate.getTime())) {
      return "Error en formato de fecha";
    }
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const year = String(parsedDate.getFullYear()).slice(-2);
    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  if (Loading) {
    return (
      <Skeleton className="col-start-9 col-span-7 row-start-1 row-end-16" />
    );
  } else if (Data.length === 0) {
    return (
      <Card className="col-start-9 col-span-7 row-start-1 row-end-16 border border-input flex flex-col items-center justify-center text-center">
        <CardHeader className="items-center pb-0">
          <CardTitle>No hay registros de stock disponibles</CardTitle>
        </CardHeader>
      </Card>
    );
  } else {
    return (
      <Card className="col-start-9 col-span-7 row-start-1 row-end-16 flex flex-col">
        <CardHeader className="items-center pb-2 text-center">
          <CardTitle>Últimos movimientos de stock</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0 w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-6/12">Producto</TableHead>
                <TableHead className="w-3/12">Movimiento</TableHead>
                <TableHead className="w-3/12">Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Data?.map((data: StockRecordInfo, index: number) => {
                return (
                  <TableRow
                    key={index}
                    onClick={() => navigate(`/catalog/stock/${data.productId}`)}
                    className="cursor-pointer"
                  >
                    <TableCell>{data.productName}</TableCell>
                    <TableCell className="flex flex-row items-center gap-2">
                      {data.record.recordType === "INCREASE" ? (
                        <ChevronUp color="#48a584" className="" />
                      ) : (
                        <ChevronDown color="#f65a5a" />
                      )}
                      {data.record.stockChange} {data.productSaleUnit}s
                    </TableCell>
                    <TableCell>
                      {formatDateTime(data.record.recordDate)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableCaption className="text-center">
              Últimos registros de stock
            </TableCaption>
          </Table>
        </CardContent>
      </Card>
    );
  }
};
