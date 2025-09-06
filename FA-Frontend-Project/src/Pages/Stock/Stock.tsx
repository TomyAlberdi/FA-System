import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { useStockContext } from "@/Context/Stock/UseStockContext";
import { ProductStock, StockRecord } from "@/hooks/CatalogInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Package,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface StockForm {
  quantity: number;
  type: "increase" | "reduce";
}

export const Stock = () => {
  const { id } = useParams();
  const { fetchStockByProduct } = useStockContext();
  const { getToken } = useKindeAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [Loading, setLoading] = useState(true);
  const [stock, setStock] = useState<ProductStock | null>(null);
  const [open, setOpen] = useState(false);
  const [LoadingRequest, setLoadingRequest] = useState(false);

  const [UpdateStock, setUpdateStock] = useState<StockForm>({
    quantity: 0,
    type: "increase",
  });

  const onSubmit = () => {
    if (UpdateStock.quantity <= 0) {
      window.alert("La cantidad debe ser mayor a 0");
      return;
    }
    updateStock(UpdateStock);
  };

  const updateStock = async (data: StockForm) => {
    setLoadingRequest(true);
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(
        `${BASE_URL}/stock/${data.type}?productId=${stock?.productId}&quantity=${data.quantity}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        console.error("Error: ", response.statusText);
        window.alert(`Error actualizando el stock: ${response.status}`);
        return;
      }
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error: ", error);
      window.alert("Ocurrió un error al actualizar el stock");
    } finally {
      setLoadingRequest(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    const productId = Number.parseInt(id);
    if (isNaN(productId)) {
      window.alert("Error al obtener el stock");
      return;
    }
    setLoading(true);
    fetchStockByProduct(productId)
      .then((result) => {
        if (!result) {
          window.alert("No se encontró el stock del producto");
          return;
        }
        setStock(result);
      })
      .catch((error) => {
        console.error("Error fetching stock:", error);
        window.alert("Error al cargar el stock del producto");
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  return (
    <div className="ProductStock flex flex-col items-start justify-start h-full gap-4">
      {Loading ? (
        <>
          <Skeleton className="w-full h-2/5" />
          <Skeleton className="w-full h-full" />
        </>
      ) : (
        stock && (
          <>
            <Card className="productData flex flex-col md:flex-row items-start justify-start gap-4 w-full p-4">
              <div
                className="productImage bg-contain bg-center bg-no-repeat w-full aspect-square md:w-1/6"
                style={
                  stock?.productImage
                    ? { backgroundImage: `url(${stock?.productImage})` }
                    : {
                        backgroundImage: `url(https://media.istockphoto.com/id/1147544807/es/vector/no-imagen-en-miniatura-gr%C3%A1fico-vectorial.jpg?s=612x612&w=0&k=20&c=Bb7KlSXJXh3oSDlyFjIaCiB9llfXsgS7mHFZs6qUgVk=)`,
                      }
                }
              ></div>
              <div className="productInfo w-full">
                <CardDescription className="text-2xl font-bold">
                  STOCK
                </CardDescription>
                <CardTitle className="md:text-6xl text-3xl font-bold">
                  <Link to={`/catalog/products/${stock?.productId}`}>
                    {stock?.productName}
                  </Link>
                </CardTitle>
                <CardContent className="flex flex-col justify-between items-start p-0 pt-4 gap-2 w-full">
                  <span className="p-2 rounded-md text-xl font-semibold border border-card-foreground w-auto">
                    {stock?.quantity} {stock?.productSaleUnit}s{" "}
                    {stock?.productSaleUnit !== stock?.productMeasureType &&
                      stock &&
                      `(${
                        Math.round(
                          (stock?.quantity * stock?.productMeasurePerSaleUnit +
                            Number.EPSILON) *
                            100
                        ) / 100
                      } ${stock?.productMeasureType})`}
                  </span>
                  <div className="adminButtons flex flex-col justify-start items-start gap-2 w-full">
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button className="text-xl md:w-56 w-full">
                          <Package className="big-icon" /> Administrar Stock
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        className="md:w-full w-[90%] md:p-6 p-3 rounded-lg"
                        aria-describedby={undefined}
                      >
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">
                            Administración de Stock de {stock?.productName}
                          </DialogTitle>
                          <DialogDescription>
                            Ingreso / Salida de {stock?.productSaleUnit}s
                          </DialogDescription>
                        </DialogHeader>
                        <div className="w-full space-y-6">
                          <RadioGroup>
                            <div className="flex items-center space-x-2 cursor-pointer">
                              <RadioGroupItem
                                value="increase"
                                id="r1"
                                onClick={() =>
                                  setUpdateStock({
                                    ...UpdateStock,
                                    type: "increase",
                                  })
                                }
                              />
                              <Label htmlFor="r1">Ingresar</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="reduce"
                                id="r2"
                                onClick={() =>
                                  setUpdateStock({
                                    ...UpdateStock,
                                    type: "reduce",
                                  })
                                }
                              />
                              <Label htmlFor="r2">Retirar</Label>
                            </div>
                          </RadioGroup>
                          <div>
                            <Label />
                            <Input
                              placeholder="Cantidad"
                              type="number"
                              defaultValue={UpdateStock.quantity}
                              onChange={(e) =>
                                setUpdateStock({
                                  ...UpdateStock,
                                  quantity: Number(e.target.value),
                                })
                              }
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={LoadingRequest}
                            onClick={() => onSubmit()}
                          >
                            {LoadingRequest && (
                              <Loader2 className="animate-spin" />
                            )}
                            Guardar
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </div>
            </Card>
            {stock?.stockRecords.length == 0 ? (
              <Alert variant="destructive" className="w-auto">
                <AlertCircle className="w-5 pt-1" />
                <AlertTitle className="text-xl">Error</AlertTitle>
                <AlertDescription className="text-lg">
                  El producto no tiene registros de stock.
                </AlertDescription>
              </Alert>
            ) : (
              <Table className="w-full h-auto">
                <TableCaption>Registros de stock</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/12">Tipo</TableHead>
                    <TableHead className="md:w-1/3 w-1/2">Cantidad</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stock?.stockRecords &&
                    stock?.stockRecords.map(
                      (record: StockRecord, i: number) => {
                        return (
                          <TableRow key={i}>
                            <TableCell>
                              {record.recordType === "INCREASE" ? (
                                <ChevronUp color="#48a584" />
                              ) : (
                                <ChevronDown color="#f65a5a" />
                              )}
                            </TableCell>
                            <TableCell>{record.stockChange}</TableCell>
                            <TableCell>
                              {formatDateTime(record.recordDate)}
                            </TableCell>
                          </TableRow>
                        );
                      }
                    )}
                </TableBody>
              </Table>
            )}
          </>
        )
      )}
    </div>
  );
};
