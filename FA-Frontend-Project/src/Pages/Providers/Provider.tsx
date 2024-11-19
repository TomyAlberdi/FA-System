import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { ToastAction } from "@/components/ui/toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CircleX, Loader2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Provider as ProviderInterface,
  StockProduct,
} from "@/hooks/CatalogInterfaces";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe contar con al menos 3 caracteres.",
  }),
  locality: z.string().min(3, {
    message: "La localidad debe contar con al menos 3 caracteres.",
  }),
  address: z.string().min(3, {
    message: "La dirección debe contar con al menos 3 caracteres.",
  }),
  phone: z.string().min(10, {
    message: "El teléfono debe contar con al menos 10 caracteres.",
  }),
  email: z.string().email({
    message: "El email no es válido.",
  }),
  cuit: z.string().length(11, {
    message: "El CUIT debe contar con 11 caracteres.",
  }),
});

export const Provider = () => {
  const { id } = useParams();
  const { BASE_URL, fetchProvider, fetchProviderProducts } =
    useCatalogContext();
  const [Provider, setProvider] = useState<ProviderInterface | null>(null);
  const [Products, setProducts] = useState<Array<StockProduct> | null>([]);
  const [Loading, setLoading] = useState(true);
  const [LoadingRequest, setLoadingRequest] = useState(false);
  const { toast } = useToast();
  const { getToken } = useKindeAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const updateCategory = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      if (typeof getToken === "function") {
        const token = await getToken();
        setLoadingRequest(true);
        try {
          const response = await fetch(`${BASE_URL}/provider/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });
          if (!response.ok) {
            console.error("Error: ", response.statusText);
            toast({
              variant: "destructive",
              title: `Error ${response.status}`,
              description: `Ocurrió un error al actualizar el proveedor.`,
            });
            return;
          }
          toast({
            title: "Proveedor actualizado",
            description: "El proveedor ha sido actualizada con éxito",
          });
        } catch (error) {
          console.error("Error: ", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Ocurrió un error al actualizar el proveedor",
          });
        } finally {
          setLoadingRequest(false);
          setOpen(false);
        }
      } else return;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      locality: "",
      address: "",
      phone: "",
      email: "",
      cuit: "",
    },
  });

  useEffect(() => {
    if (id) {
      fetchProvider(Number.parseInt(id))
        .then((result) => {
          setProvider(result ?? null);
          form.reset({
            name: result?.name ?? "",
            locality: result?.locality ?? "",
            address: result?.address ?? "",
            phone: result?.phone ?? "",
            email: result?.email ?? "",
            cuit: result?.cuit ?? "",
          });
        })
        .finally(() => setLoading(false));
      fetchProviderProducts(Number.parseInt(id)).then((result) =>
        setProducts(result ?? null)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, BASE_URL, open]);

  const onDeletePres = () => {
    if (Provider && Provider?.productsAmount > 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El proveedor tiene productos asociados.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Confirmación",
        description: "¿Desea eliminar el proveedor?",
        action: (
          <ToastAction altText="Eliminar" onClick={deleteProvider}>
            Eliminar
          </ToastAction>
        ),
      });
    }
  };

  const deleteProvider = async () => {
    if (typeof getToken === "function") {
      const token = await getToken();
      try {
        const response = await fetch(`${BASE_URL}/provider/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          console.error("Error: ", response.statusText);
          toast({
            variant: "destructive",
            title: `Error ${response.status}`,
            description: `Ocurrió un error al eliminar el proveedor.`,
          });
          return;
        }
        toast({
          title: "Proveedor eliminado",
          description: "El proveedor ha sido eliminado con éxito",
        });
        navigate("/catalog/providers");
      } catch (error) {
        console.error("Error: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al eliminar el proveedor",
        });
      }
    } else return;
  };

  return (
    <div className="CatalogPage ProviderPage h-full">
      {Loading || !Provider ? (
        <div className="loading w-1/5 h-1/5">
          <h1 className="text-xl">Cargando...</h1>
          <Skeleton className="h-4 w-[100px]" />
        </div>
      ) : Provider ? (
        <section className="CatalogPageData h-full w-full">
          <div className="CatalogPageInfo h-2/3 w-1/3">
            <Card className="w-5/6">
              <CardHeader>
                <CardDescription className="text-xl">Proveedor</CardDescription>
                <CardTitle className="text-4xl">{Provider.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Cantidad de productos:{" "}
                  <span className="text-secondary-foreground">
                    {Provider.productsAmount}
                  </span>
                </CardDescription>
                <CardDescription className="text-lg">
                  Localidad:{" "}
                  <span className="text-secondary-foreground">
                    {Provider.locality}
                  </span>
                </CardDescription>
                <CardDescription className="text-lg">
                  Dirección:{" "}
                  <span className="text-secondary-foreground">
                    {Provider.address}
                  </span>
                </CardDescription>
                <CardDescription className="text-lg">
                  Teléfono:{" "}
                  <span className="text-secondary-foreground">
                    {Provider.phone}
                  </span>
                </CardDescription>
                <CardDescription className="text-lg">
                  Email:{" "}
                  <span className="text-secondary-foreground">
                    {Provider.email}
                  </span>
                </CardDescription>
                <CardDescription className="text-lg">
                  CUIT:{" "}
                  <span className="text-secondary-foreground">
                    {Provider.cuit}
                  </span>
                </CardDescription>
              </CardContent>
              <CardContent>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full mb-2">
                      <Pencil />
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-[500px] w-full"
                    aria-describedby={undefined}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">
                        Editar proveedor
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(updateCategory)}
                        className="w-full grid grid-cols-2 grid-rows-4 gap-4"
                      >
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="col-start-1 row-start-1">
                              <FormLabel>Nombre</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="locality"
                          render={({ field }) => (
                            <FormItem className="col-start-1 row-start-2">
                              <FormLabel>Localidad</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="col-start-1 row-start-3">
                              <FormLabel>Dirección</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem className="col-start-2 row-start-1">
                              <FormLabel>Teléfono</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="col-start-2 row-start-2">
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cuit"
                          render={({ field }) => (
                            <FormItem className="col-start-2 row-start-3">
                              <FormLabel>CUIT</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="col-span-2 col-start-1 flex justify-center items-center">
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
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={onDeletePres}
                >
                  <CircleX />
                  Eliminar
                </Button>
              </CardContent>
            </Card>
          </div>
          <ScrollArea className="CatalogPageList w-2/3">
            <h1 className="text-xl text-muted-foreground text-left pb-5">
              Lista de productos
            </h1>
            {Products && Products?.length > 0 ? (
              <Table>
                <TableCaption>Lista de productos</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/12">ID</TableHead>
                    <TableHead className="w-1/3">Nombre</TableHead>
                    <TableHead className="w-1/3">Stock</TableHead>
                    <TableHead>Precio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Products?.map((product: StockProduct, i: number) => {
                    return (
                      <TableRow
                        key={i}
                        className={
                          product.disabled
                            ? "cursor-pointer opacity-50 text-red-700"
                            : "cursor-pointer"
                        }
                        onClick={() =>
                          navigate(`/catalog/products/${product.id}`)
                        }
                      >
                        <TableCell className="font-medium">
                          {product.id}
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          {product.stock} {product.saleUnit}s
                          {product.saleUnit !== product.measureType &&
                            ` (${product.measurePerSaleUnit * product.stock} ${
                              product.measureType
                            })`}
                        </TableCell>
                        <TableCell>
                          ${product.saleUnitPrice} / {product.saleUnit}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <Alert variant="destructive" className="w-auto">
                <AlertCircle className="w-5 pt-1" />
                <AlertTitle className="text-xl">Error</AlertTitle>
                <AlertDescription className="text-lg">
                  El proveedor no tiene productos asociados.
                </AlertDescription>
              </Alert>
            )}
          </ScrollArea>
        </section>
      ) : null}
    </div>
  );
};
