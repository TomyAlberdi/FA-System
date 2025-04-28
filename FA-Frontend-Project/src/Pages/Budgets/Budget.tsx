import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSalesContext } from "@/Context/UseSalesContext";
import { CompleteBudget, ProductBudget } from "@/hooks/SalesInterfaces";
import { CircleX, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateBudgetStatus } from "@/Pages/Budgets/UpdateBudgetStatus";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DownloadBudgetDetail } from "@/Pages/Budgets/DownloadBudgetDetail";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Budget = () => {
  const { id } = useParams();
  const { BASE_URL, fetchCompleteBudget } = useSalesContext();
  const { getToken } = useKindeAuth();
  const navigate = useNavigate();
  const [Budget, setBudget] = useState<CompleteBudget | null>(null);
  const [Loading, setLoading] = useState(true);
  const [Reload, setReload] = useState(false);

  useEffect(() => {
    if (!id) {
      window.alert("Ocurrió un error al obtener el presupuesto.");
      navigate(-1);
      return;
    }
    const budgetId = Number.parseInt(id);
    if (isNaN(budgetId)) {
      window.alert("Ocurrió un error al obtener el presupuesto.");
      navigate(-1);
      return;
    }
    setLoading(true);
    fetchCompleteBudget(budgetId)
      .then((result) => {
        if (!result) {
          window.alert("Ocurrió un error al obtener el presupuesto.");
          navigate(-1);
          return;
        }
        setBudget(result ?? null);
      })
      .catch((error) => {
        console.error("Error fetching budget:", error);
        window.alert("Ocurrió un error al obtener el presupuesto.");
        navigate(-1);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, Reload]);

  const [OpenUpdateStatus, setOpenUpdateStatus] = useState(false);

  const onDeletePres = () => {
    if (Budget && Budget?.id) {
      if (window.confirm("¿Desea eliminar el presupuesto?")) {
        deleteBudget();
      }
    }
  };

  const deleteBudget = async () => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/budget/${Budget?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error: ", response.statusText);
        window.alert(`Error eliminando el presupuesto: ${response.status}`);
        return;
      }
      window.alert("El presupuesto ha sido eliminado con éxito");
      navigate("/sales/budgets");
    } catch (error) {
      console.error("Error: ", error);
      window.alert("Ocurrió un error al eliminar el presupuesto");
    }
  };

  return Loading ? (
    <div className="flex md:flex-row flex-col gap-4 h-full">
      <Skeleton className="md:w-1/3 h-full w-full" />
      <Skeleton className="md:w-2/3 md:h-full w-full h-1/2 hidden md:block  " />
    </div>
  ) : (
    <div className="flex md:flex-row flex-col gap-4">
      <Card className="md:w-1/3 w-full">
        <CardHeader>
          <CardTitle className="text-3xl">
            Presupuesto {Budget?.id?.toString().padStart(10, "0")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Separator />
          <div className="flex flex-col gap-2">
            <span className="text-lg">Cliente:</span>
            <span className="text-2xl">{Budget?.clientName}</span>
          </div>
        </CardContent>
        <CardContent className="flex flex-col gap-4">
          <Separator />
          <div className="flex flex-col gap-2">
            <span className="text-lg">Fecha:</span>
            <span className="text-2xl">
              {new Date(Budget?.date ?? "").toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
        </CardContent>
        <CardContent className="flex flex-col gap-4">
          <Separator />
          <div className="flex flex-row justify-between items-start">
            <div className="flex flex-col gap-1">
              <div className="flex flex-col mb-2">
                <span className="text-lg">Estado del Presupuesto:</span>
                <span className="text-2xl">{Budget?.status}</span>
              </div>
              <div>
                <span className="text-lg">Estado del Stock:</span>
                <span className="text-2xl flex flex-row gap-2 items-center">
                  {Budget?.stockDecreased ? "RESERVADO" : "DISPONIBLE"}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-5 h-5" />
                    </TooltipTrigger>
                    <TooltipContent className="w-[250px]">
                      Cuando el stock de un presupuesto se encuentra RESERVADO,
                      indica que los productos ya fueron registrados y retirados
                      del sistema. Esto ocurre cuando el estado del presupuesto
                      se cambia a PAGO, ENVIADO o ENTREGADO, y no puede
                      deshacerse.
                    </TooltipContent>
                  </Tooltip>
                </span>
              </div>
            </div>
            <Dialog open={OpenUpdateStatus} onOpenChange={setOpenUpdateStatus}>
              <DialogTrigger asChild>
                <Button>Actualizar estado</Button>
              </DialogTrigger>
              <UpdateBudgetStatus
                id={Budget?.id}
                stockDecreased={Budget?.stockDecreased}
                setOpenUpdateStatus={setOpenUpdateStatus}
                Reload={Reload}
                setReload={setReload}
              />
            </Dialog>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-lg">Descuento:</span>
            <span className="text-2xl">
              {Budget?.discount ? Budget?.discount : "0"}%
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-lg">Monto final:</span>
            <span className="text-2xl">$ {Budget?.finalAmount}</span>
          </div>
        </CardContent>
        <CardContent className="flex flex-col gap-4">
          <Button
            className="w-full"
            variant="destructive"
            onClick={onDeletePres}
          >
            <CircleX />
            Eliminar
          </Button>
          <DownloadBudgetDetail budget={Budget} />
        </CardContent>
      </Card>
      <ScrollArea className="md:w-2/3 w-[95vw] h-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-2/12">Cantidad solicitada</TableHead>
              <TableHead className="w-3/12">Cantidad de unidades</TableHead>
              <TableHead className="w-2/12">Nombre</TableHead>
              <TableHead className="w-2/12">Precio unitario</TableHead>
              <TableHead className="w-1/12">Descuento</TableHead>
              <TableHead className="w-2/12">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Budget?.products?.map((product: ProductBudget, index: number) => {
              return (
                <TableRow
                  key={index}
                  className="cursor-pointer"
                  onClick={() => navigate(`/catalog/products/${product.id}`)}
                >
                  <TableCell className="font-medium">
                    {product.measureUnitQuantity} {product.productMeasureUnit}
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.saleUnitQuantity} {product.productSaleUnit}
                  </TableCell>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>$ {product.productMeasurePrice}</TableCell>
                  <TableCell>
                    {!product.discountPercentage
                      ? "N/A"
                      : product.discountPercentage + "%"}
                  </TableCell>
                  <TableCell>
                    ${" "}
                    {product.discountPercentage === 0
                      ? Math.round(
                          (product.saleUnitQuantity * product.saleUnitPrice +
                            Number.EPSILON) *
                            100
                        ) / 100
                      : Math.round(
                          (product.saleUnitQuantity *
                            product.saleUnitPrice *
                            (1 - product.discountPercentage / 100) +
                            Number.EPSILON) *
                            100
                        ) / 100}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};
