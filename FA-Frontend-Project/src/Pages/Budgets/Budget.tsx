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
import { useToast } from "@/hooks/use-toast";
import { CircleX, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateBudgetStatus } from "@/Pages/Budgets/UpdateBudgetStatus";

export const Budget = () => {
  const { id } = useParams();
  const { fetchCompleteBudget } = useSalesContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [Budget, setBudget] = useState<CompleteBudget | null>(null);
  const [Loading, setLoading] = useState(true);
  const [Reload, setReload] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchCompleteBudget(Number.parseInt(id))
        .then((result) => {
          if (!result) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Ocurrió un error al obtener el presupuesto.",
            });
            navigate(-1);
          }
          setBudget(result ?? null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, Reload]);

  const [OpenUpdateStatus, setOpenUpdateStatus] = useState(false);

  return Loading ? (
    <div className="flex flex-row gap-4 h-full">
      <Skeleton className="w-1/3 h-full" />
      <Skeleton className="w-2/3 h-full" />
    </div>
  ) : (
    <div className="flex flex-row gap-4">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle className="text-3xl">Presupuesto</CardTitle>
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
          <div className="flex flex-row justify-between items-center">
            <div>
              <span className="text-lg">Estado:</span>
              <span className="text-2xl flex flex-row gap-2 items-center">
                {Budget?.status}
              </span>
            </div>
            <Dialog open={OpenUpdateStatus} onOpenChange={setOpenUpdateStatus}>
              <DialogTrigger asChild>
                <Button>Actualizar estado</Button>
              </DialogTrigger>
              <UpdateBudgetStatus
                id={Budget?.id}
                setOpenUpdateStatus={setOpenUpdateStatus}
                Reload={Reload}
                setReload={setReload}
              />
            </Dialog>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-lg">Monto final:</span>
            <span className="text-2xl">$ {Budget?.finalAmount}</span>
          </div>
        </CardContent>
        <CardContent className="flex flex-col gap-4">
          <Button className="w-full">
            <Pencil />
            Editar
          </Button>
          <Button className="w-full" variant="destructive">
            <CircleX />
            Eliminar
          </Button>
        </CardContent>
      </Card>
      <div className="w-2/3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-2/12">Cantidad solicitada</TableHead>
              <TableHead className="w-3/12">Cantidad de unidades</TableHead>
              <TableHead className="w-3/12">Nombre</TableHead>
              <TableHead className="w-2/12">Precio unitario</TableHead>
              <TableHead className="w-2/12">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Budget?.products?.map((product: ProductBudget, index: number) => {
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {product.measureUnitQuantity} {product.productMeasureUnit}
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.saleUnitQuantity} {product.productSaleUnit}
                  </TableCell>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>$ {product.productMeasurePrice}</TableCell>
                  <TableCell>
                    ${" "}
                    {Math.round(
                      (product.saleUnitQuantity * product.saleUnitPrice +
                        Number.EPSILON) *
                        100
                    ) / 100}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
