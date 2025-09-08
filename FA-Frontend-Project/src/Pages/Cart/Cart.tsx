import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBudgetContext } from "@/Context/Budget/UseBudgetContext";
import { CreateBudgetDTO, ProductBudget } from "@/hooks/SalesInterfaces";
import CreateBudgetClient from "@/Pages/Budgets/CreateBudgetClient";
import { FloatingClientPagination } from "@/Pages/Budgets/FloatingClientPagination";
import {
  AlertCircle,
  Ban,
  Loader2,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Cart = () => {
  const {
    createBudget,
    CurrentBudget,
    updateCurrentBudget,
    clearCurrentBudget,
  } = useBudgetContext();
  const [LoadingRequest, setLoadingRequest] = useState(false);

  const onCreateBudget = () => {
    if (CurrentBudget?.products?.length === 0) {
      window.alert("El presupuesto no tiene productos asociados.");
      return;
    }
    if (CurrentBudget) submitBudget(CurrentBudget);
  };

  const submitBudget = async (Budget: CreateBudgetDTO) => {
    setLoadingRequest(true);
    if (CurrentBudget?.clientId) {
      await createBudget(Budget, CurrentBudget.clientId).finally(() => {
        setLoadingRequest(false);
        clearCurrentBudget();
      });
    } else {
      createBudget(Budget).finally(() => {
        setLoadingRequest(false);
        clearCurrentBudget();
      });
    }
  };

  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds()
  ).padStart(2, "0")}`;

  const removeProductFromBudget = (product: ProductBudget) => {
    const newBudgetProducts = CurrentBudget?.products.filter(
      (budgetProduct) => budgetProduct.id !== product.id
    );
    const updatedBudget = {
      ...CurrentBudget,
      products: newBudgetProducts,
    };
    updateCurrentBudget(updatedBudget);
  };

  return (
    <div>
      <h1 className="sectionTitle text-3xl">Carrito</h1>
      <div className="w-full pt-2 h-full flex flex-col gap-4">
        <Card className="flex flex-col">
          <CardHeader className="hidden md:flex">
            <CardTitle>Información del Carrito</CardTitle>
          </CardHeader>
          <CardContent className="flex md:flex-row flex-col justify-start gap-4 md:p-6 p-3 md:pt-6">
            <div className="flex flex-col gap-2 md:w-1/6 w-full">
              {!CurrentBudget?.client ? (
                <Label className="text-xl text-center">
                  Sin cliente asociado.
                </Label>
              ) : (
                <span></span>
              )}
              <section className="flex flex-col gap-2">
                {!CurrentBudget?.client ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="mt-2">
                        <Search />
                        Seleccionar cliente
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      aria-describedby={undefined}
                      className="md:max-w-[50vw] md:w-full w-[90%] max-h-[90vh] md:h-full h-auto flex flex-col md:p-6 p-3"
                    >
                      <DialogTitle className="text-xl font-bold">
                        Seleccionar cliente
                      </DialogTitle>
                      <FloatingClientPagination />
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button
                    className="mt-2 hover:bg-destructive hover:text-white"
                    onClick={() => {
                      updateCurrentBudget({
                        ...CurrentBudget,
                        clientId: 0,
                        client: undefined,
                      });
                    }}
                  >
                    {CurrentBudget.client.name}
                  </Button>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle />
                      Crear Cliente
                    </Button>
                  </DialogTrigger>
                  <DialogContent aria-describedby={undefined} className="p-4">
                    <CreateBudgetClient />
                  </DialogContent>
                </Dialog>
              </section>
            </div>
            <section className="flex md:flex-row flex-col justify-evenly align-center md:w-4/6 w-auto">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col align-center justify-center">
                  <Label className="text-lg">Fecha:</Label>
                  <span className="md:text-3xl text-xl font-semibold">
                    {new Date(formattedDate).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex flex-col align-center justify-center">
                  <Label className="text-lg">
                    Descuento:{" "}
                    {!Number.isNaN(CurrentBudget.discount)
                      ? `${CurrentBudget.discount} %`
                      : "0 %"}
                  </Label>
                  <Input
                    className="my-4"
                    type="number"
                    defaultValue={CurrentBudget.discount ?? 0}
                    min={0}
                    max={100}
                    onChange={(e) => {
                      const numValue = Number(e.target.value);
                      updateCurrentBudget({
                        ...CurrentBudget,
                        discount: numValue,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col align-center justify-center">
                <Label className="text-lg">Monto final:</Label>
                <span className="text-3xl font-semibold">
                  ${" "}
                  {!Number.isNaN(CurrentBudget.total)
                    ? `${CurrentBudget.total}`
                    : "0"}
                </span>
              </div>
            </section>
            <section className="md:w-1/6 w-full flex flex-col justify-evenly gap-4">
              <div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={LoadingRequest}
                  onClick={onCreateBudget}
                >
                  {LoadingRequest && <Loader2 className="animate-spin" />}
                  Crear Presupuesto
                </Button>
              </div>
              <div>
                <Button
                  className="w-full"
                  onClick={clearCurrentBudget}
                  variant="destructive"
                >
                  <Ban />
                  Cancelar
                </Button>
              </div>
            </section>
          </CardContent>
        </Card>
        <div className="flex flex-col items-start justify-center">
          <section className="flex justify-between items-center w-full">
            <Label className="text-2xl">Productos</Label>
            <Button asChild className="font-semibold">
              <Link to="/catalog/products">
                <PlusCircle />
                Añadir productos
              </Link>
            </Button>
          </section>
          {CurrentBudget?.products.length === 0 ? (
            <Alert variant="destructive" className="md:w-auto w-full mt-2">
              <AlertCircle className="w-5 pt-1" />
              <AlertTitle className="text-xl">Vacío</AlertTitle>
              <AlertDescription className="text-lg">
                No hay productos en el carrito.
              </AlertDescription>
            </Alert>
          ) : (
            <ScrollArea className="md:w-full w-[95vw] h-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-2/12">
                      Cantidad solicitada
                    </TableHead>
                    <TableHead className="w-2/12">
                      Cantidad de unidades
                    </TableHead>
                    <TableHead className="w-3/12">Nombre</TableHead>
                    <TableHead className="w-2/12">Precio unitario</TableHead>
                    <TableHead className="w-1/12">Descuento</TableHead>
                    <TableHead className="w-1/12">Subtotal</TableHead>
                    <TableHead className="w-1/12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CurrentBudget?.products.map(
                    (product: ProductBudget, index: number) => {
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {product.measureUnitQuantity}{" "}
                            {product.productMeasureUnit}
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.saleUnitQuantity} {product.productSaleUnit}
                          </TableCell>
                          <TableCell>{product.productName}</TableCell>
                          <TableCell>$ {product.productMeasurePrice}</TableCell>
                          <TableCell>{product.discountPercentage}%</TableCell>
                          <TableCell>
                            ${" "}
                            {product.discountPercentage === 0
                              ? Math.round(
                                  (product.saleUnitQuantity *
                                    product.saleUnitPrice +
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
                          <TableCell>
                            <Button
                              onClick={() => removeProductFromBudget(product)}
                            >
                              <Trash2 className="bigger-icon" color="red" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
};
export default Cart;
