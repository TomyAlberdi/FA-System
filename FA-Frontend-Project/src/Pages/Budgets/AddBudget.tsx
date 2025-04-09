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
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Ban, CirclePlus, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FloatingProductPagination } from "@/Pages/Budgets/FloatingProductPagination";
import { CardProduct } from "@/hooks/CatalogInterfaces";
import { FloatingClientPagination } from "@/Pages/Budgets/FloatingClientPagination";
import { useSalesContext } from "@/Context/UseSalesContext";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";

export const AddBudget = () => {
  const { BASE_URL } = useSalesContext();
  const { getToken } = useKindeAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const BUDGET_STORAGE_KEY = "currentBudget";

  // budget logic
  const [Budget, setBudget] = useState<{
    client: {
      id: number;
      name: string;
    };
    products: ProductBudget[];
  }>(() => {
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

  const submitBudget = async () => {
    if (Budget?.products?.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El presupuesto no tiene productos asociados.",
      });
      return;
    } else if (Budget?.client.id === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El presupuesto no tiene cliente asociado.",
      });
      return;
    }
    try {
      if (!getToken) {
        console.error("getToken is undefined");
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
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al crear el presupuesto.",
        });
        return;
      }
      toast({
        title: "Presupuesto creado",
        description: "El presupuesto se ha creado correctamente.",
      });
      clearBudget();
      const responseData = await response.json();
      navigate(`/sales/budgets/${responseData.id}`);
    } catch (error) {
      console.error("Error submitting budget: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al crear el presupuesto.",
      });
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
      <div className="w-full px-5 pt-2 h-[calc(100svh-9rem)] flex flex-col gap-4">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Información del Presupuesto</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row justify-start gap-4">
            <div className="flex flex-col gap-2 w-1/6">
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
                  className="max-w-[50vw] w-full max-h-[90vh] h-full flex flex-col p-6"
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
            <section className="flex flex-row justify-evenly align-center w-4/6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col align-center justify-center">
                  <Label className="text-lg">Fecha de emisión:</Label>
                  <span className="text-3xl font-semibold">
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
                  <Label className="text-lg">Descuento: {Discount[0]}%</Label>
                  <Slider
                    className="my-4"
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setDiscount(value)}
                  />
                </div>
              </div>

              <div className="flex flex-col align-center justify-center">
                <Label className="text-lg">Monto final:</Label>
                <span className="text-3xl font-semibold">$ {FinalAmount}</span>
              </div>
            </section>
            <section className="w-1/6 flex flex-col justify-evenly gap-4">
              <div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={LoadingRequest}
                  onClick={submitBudget}
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
                className="max-w-[80vw] w-full max-h-[90vh] h-full flex flex-col p-6"
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
            <Alert variant="destructive" className="w-full mt-2">
              <AlertCircle className="w-5 pt-1" />
              <AlertTitle className="text-xl">Vacío</AlertTitle>
              <AlertDescription className="text-lg">
                El presupuesto no tiene productos asociados.
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-2/12">Cantidad solicitada</TableHead>
                  <TableHead className="w-2/12">Cantidad de unidades</TableHead>
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
          )}
        </div>
      </div>
    </div>
  );
};
