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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { ProductStock, StockRecord } from "@/hooks/CatalogInterfaces";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Package,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { z } from "zod";

//TODO: Migrate from form to regular input
const formSchema = z.object({
  quantity: z.coerce.number().min(1, {
    message: "La cantidad debe ser mayor a 0",
  }),
  type: z.enum(["increase", "reduce"], {
    required_error: "Debe seleccionar un tipo de operación",
  }),
});

//TODO: Mobile Stock Page
export const Stock = () => {
  const { id } = useParams();
  const { fetchProductStock, BASE_URL } = useCatalogContext();
  const { getToken } = useKindeAuth();

  const [Loading, setLoading] = useState(true);
  const [stock, setStock] = useState<ProductStock | null>(null);
  const [open, setOpen] = useState(false);
  const [LoadingRequest, setLoadingRequest] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 0,
    },
  });

  const updateStock = async (data: z.infer<typeof formSchema>) => {
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
        toast({
          variant: "destructive",
          title: `Error ${response.status}`,
          description: `Ocurrió un error al actualizar el stock.`,
        });
        return;
      }
      toast({
        title: "Stock actualizado",
        variant: "default",
        description: "El stock ha sido actualizado con éxito",
      });
    } catch (error) {
      console.error("Error: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al actualizar el stock",
      });
    } finally {
      setLoadingRequest(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchProductStock(Number.parseInt(id))
        .then((result) => setStock(result ?? null))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, open]);

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
            <Card className="productData flex flex-row items-start justify-start gap-4 w-full p-4">
              <div
                className="productImage bg-contain bg-center bg-no-repeat h-full w-1/5"
                style={
                  stock?.productImage
                    ? { backgroundImage: `url(${stock?.productImage})` }
                    : {
                        backgroundImage: `url(https://media.istockphoto.com/id/1147544807/es/vector/no-imagen-en-miniatura-gr%C3%A1fico-vectorial.jpg?s=612x612&w=0&k=20&c=Bb7KlSXJXh3oSDlyFjIaCiB9llfXsgS7mHFZs6qUgVk=)`,
                      }
                }
              ></div>
              <div className="productInfo">
                <CardDescription className="text-2xl font-bold">
                  STOCK
                </CardDescription>
                <CardTitle className="text-6xl font-bold">
                  <Link to={`/catalog/products/${stock?.productId}`}>
                    {stock?.productName}
                  </Link>
                </CardTitle>
                <CardContent className="flex flex-col justify-between items-start p-0 pt-4 gap-2">
                  <span className="p-2 rounded-md text-xl font-semibold border border-card-foreground">
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
                  <div className="adminButtons flex flex-col justify-start items-start gap-2">
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button className="text-xl w-56">
                          <Package className="big-icon" /> Administrar Stock
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        className="sm:max-w-[500px] w-full p-6"
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
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(updateStock)}
                            className="w-2/3 space-y-6"
                          >
                            <FormField
                              control={form.control}
                              name="type"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tipo</FormLabel>
                                  <FormControl>
                                    <RadioGroup onValueChange={field.onChange}>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value="increase"
                                          id="r1"
                                        />
                                        <Label htmlFor="r1">Ingresar</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value="reduce"
                                          id="r2"
                                        />
                                        <Label htmlFor="r2">Retirar</Label>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="quantity"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cantidad</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Cantidad"
                                      type="number"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <Button
                              type="submit"
                              className="w-full"
                              disabled={LoadingRequest}
                            >
                              {LoadingRequest && (
                                <Loader2 className="animate-spin" />
                              )}
                              Guardar
                            </Button>
                          </form>
                        </Form>
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
                    <TableHead className="w-1/3">Cantidad</TableHead>
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
