import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BudgetStatus,
  PartialClient,
  ProductBudget,
} from "@/hooks/SalesInterfaces";
import { AlertCircle, Ban, CirclePlus, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FloatingProductPagination } from "@/Pages/Budgets/FloatingProductPagination";
import { CardProduct } from "@/hooks/CatalogInterfaces";
import { FloatingClientPagination } from "@/Pages/Budgets/FloatingClientPagination";
import { useSalesContext } from "@/Context/UseSalesContext";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface CreationBudget {
  client: {
    id: number;
    name: string;
  };
  products: ProductBudget[];
}

export const AddBudget = () => {
  const { BASE_URL } = useSalesContext();
  const { getToken } = useKindeAuth();
  const navigate = useNavigate();
  const BUDGET_STORAGE_KEY = "currentBudget";

  // budget logic
  const [Budget, setBudget] = useState<CreationBudget>(() => {
    const savedBudget = sessionStorage.getItem(BUDGET_STORAGE_KEY);
    return savedBudget
      ? JSON.parse(savedBudget)
      : {
          client: {
            id: 0,
            name: "",
          },
          products: [],
        };
  });
  const [LoadingRequest, setLoadingRequest] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(Budget));
  }, [Budget]);

  const clearBudget = () => {
    sessionStorage.removeItem(BUDGET_STORAGE_KEY);
    setBudget({
      client: {
        id: 0,
        name: "",
      },
      products: [],
    });
  };

  const onSubmit = () => {
    if (Budget?.client.id === 0) {
      window.alert("El presupuesto no tiene cliente asociado.");
      return;
    }
    if (Budget?.products?.length === 0) {
      window.alert("El presupuesto no tiene productos asociados.");
      return;
    }
    submitBudget(Budget);
  };

  const submitBudget = async (Budget: CreationBudget) => {
    setLoadingRequest(true);
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        setLoadingRequest(false);
        return;
      }
      const accessToken = await getToken();
      const body = JSON.stringify({
        date: formattedDate,
        clientId: Budget.client.id,
        clientName: Budget.client.name,
        status: BudgetStatus.PENDIENTE,
        products: Budget.products,
        discount: Discount[0] ?? 0,
        finalAmount: FinalAmount,
      });
      const response = await fetch(`${BASE_URL}/budget`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: body,
      });
      if (!response.ok) {
        console.error("Error submitting budget: ", response.status);
        window.alert(`Error creando el presupuesto: ${response.status}`);
        return;
      }
      const responseData = await response.json();
      clearBudget();
      window.alert("El presupuesto se ha creado correctamente.");
      navigate(`/sales/budgets/${responseData.id}`);
    } catch (error) {
      console.error("Error submitting budget: ", error);
      window.alert("Ocurrió un error al crear el presupuesto.");
    } finally {
      setLoadingRequest(false);
    }
  };

  // Client list for selection
  const [OpenClientPagination, setOpenClientPagination] = useState(false);
  const handleSelectClient = (client: PartialClient) => {
    setBudget({
      ...Budget,
      client: client,
    });
    setOpenClientPagination(false);
  };

  // Product list for selection
  const [OpenProductPagination, setOpenProductPagination] = useState(false);
  const handleAddProduct = (
    product: CardProduct,
    measureUnitQuantity: number,
    saleUnitQuantity: number,
    discountPercentage: number,
    subtotal: number
  ) => {
    const newBudgetProduct = {
      id: product.id,
      productName: product.name,
      productMeasurePrice: product.measurePrice,
      measureUnitQuantity: measureUnitQuantity,
      saleUnitQuantity: saleUnitQuantity,
      discountPercentage: discountPercentage,
      subtotal: subtotal,
      productSaleUnit: product.saleUnit,
      productMeasureUnit: product.measureType,
      saleUnitPrice: product.saleUnitPrice,
    };
    setBudget({
      ...Budget,
      products: [...Budget.products, newBudgetProduct],
    });
  };

  // Current date with time
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds()
  ).padStart(2, "0")}`;
  // Final Amount calculation
  const [FinalAmount, setFinalAmount] = useState(0);
  const [Discount, setDiscount] = useState<Array<number>>([0]);
  useEffect(() => {
    let total = 0;
    Budget?.products?.forEach((product: ProductBudget) => {
      if (product.subtotal > 0) {
        total += product.subtotal;
      }
    });
    if (Discount[0] === 0) {
      setFinalAmount(Math.round(total * 100) / 100);
      return;
    }
    const discountedFinalAmount =
      Math.round((total * (1 - Discount[0] / 100) + Number.EPSILON) * 100) /
      100;
    setFinalAmount(discountedFinalAmount);
  }, [Budget, Discount]);

  const removeProductFromBudget = (product: ProductBudget) => {
    setBudget({
      ...Budget,
      products: Budget.products.filter(
        (budgetProduct) => budgetProduct.id !== product.id
      ),
    });
  };

  return (
    <div>
      <h1 className="sectionTitle text-3xl">Crear Presupuesto</h1>
      <div className="w-full pt-2 h-full flex flex-col gap-4">
        <Card className="flex flex-col">
          <CardHeader className="hidden md:flex">
            <CardTitle>Información del Presupuesto</CardTitle>
          </CardHeader>
          <CardContent className="flex md:flex-row flex-col justify-start gap-4 md:p-6 p-3 md:pt-6">
            <div className="flex flex-col gap-2 md:w-1/6 w-full">
              <Label className="text-lg">Cliente:</Label>
              <Dialog
                open={OpenClientPagination}
                onOpenChange={setOpenClientPagination}
              >
                <DialogTrigger asChild>
                  <Button className="mt-2">
                    {Budget.client.name === ""
                      ? "Seleccionar cliente"
                      : Budget.client.name}
                  </Button>
                </DialogTrigger>
                <DialogContent
                  aria-describedby={undefined}
                  className="md:max-w-[50vw] md:w-full w-[90%] max-h-[90vh] md:h-full h-auto flex flex-col md:p-6 p-3"
                >
                  <DialogTitle className="text-xl font-bold">
                    Seleccionar cliente
                  </DialogTitle>
                  <FloatingClientPagination
                    handleSelectClient={handleSelectClient}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <section className="flex md:flex-row flex-col justify-evenly align-center md:w-4/6 w-auto">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col align-center justify-center">
                  <Label className="text-lg">Fecha de emisión:</Label>
                  <span className="md:text-3xl text-xl font-semibold">
                    {new Date(formattedDate).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex flex-col align-center justify-center">
                  <Label className="text-lg">
                    Descuento:{" "}
                    {!Number.isNaN(Discount[0]) ? `${Discount[0]} %` : "0 %"}
                  </Label>
                  <Slider
                    className="my-4 md:flex hidden"
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setDiscount(value)}
                  />
                  <Input
                    className="my-4 block md:hidden"
                    type="number"
                    min={0}
                    max={100}
                    value={Discount[0]}
                    onChange={(e) => setDiscount([parseFloat(e.target.value)])}
                  />
                </div>
              </div>
              <div className="flex flex-col align-center justify-center">
                <Label className="text-lg">Monto final:</Label>
                <span className="text-3xl font-semibold">
                  $ {!Number.isNaN(FinalAmount) ? `${FinalAmount}` : "0"}
                </span>
              </div>
            </section>
            <section className="md:w-1/6 w-full flex flex-col justify-evenly gap-4">
              <div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={LoadingRequest}
                  onClick={onSubmit}
                >
                  {LoadingRequest && <Loader2 className="animate-spin" />}
                  Crear Presupuesto
                </Button>
              </div>
              <div>
                <Button
                  className="w-full"
                  onClick={clearBudget}
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
          <section className="mb-2">
            <Label className="text-2xl mr-6">Productos</Label>
            <Dialog
              open={OpenProductPagination}
              onOpenChange={setOpenProductPagination}
            >
              <DialogTrigger asChild>
                <Button className="mt-2">
                  <CirclePlus />
                  Añadir producto
                </Button>
              </DialogTrigger>
              <DialogContent
                className="md:max-w-[80vw] md:w-full w-[92.5%] md:max-h-[90vh] md:h-full h-[95%] flex flex-col md:p-6 p-2 rounded-lg"
                aria-describedby={undefined}
              >
                <DialogTitle className="text-xl font-bold">
                  Añadir Producto
                </DialogTitle>
                <FloatingProductPagination
                  handleAddProduct={handleAddProduct}
                />
              </DialogContent>
            </Dialog>
          </section>
          {Budget?.products?.length === 0 ? (
            <Alert variant="destructive" className="md:w-auto w-full mt-2">
              <AlertCircle className="w-5 pt-1" />
              <AlertTitle className="text-xl">Vacío</AlertTitle>
              <AlertDescription className="text-lg">
                El presupuesto no tiene productos asociados.
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
                  {Budget?.products?.map(
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
