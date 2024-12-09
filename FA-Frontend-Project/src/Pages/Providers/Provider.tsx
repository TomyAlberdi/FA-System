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
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { ToastAction } from "@/components/ui/toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CircleX, Plus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Provider as ProviderInterface,
  StockProduct,
} from "@/hooks/CatalogInterfaces";
import { UpdateProvider } from "@/Pages/Providers/UpdateProvider";
import { UpdatePriceProvider } from "@/Pages/Providers/UpdatePriceProvider";

const formSchema = z.object({
  id: z.number(),
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
  const [LastLoadedPage, setLastLoadedPage] = useState(0);
  const [IsLastPage, setIsLastPage] = useState(false);
  const [Loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { getToken } = useKindeAuth();
  const navigate = useNavigate();
  const [Reload, setReload] = useState(false);

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
          if (!result) {
            navigate(-1);
          }
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, BASE_URL, Reload]);

  useEffect(() => {
    if (id) {
      fetchProviderProducts(Number.parseInt(id), LastLoadedPage, 8).then(
        (result) => {
          setProducts(
            Products ? [...Products, ...result.content] : result.content
          );
          setIsLastPage(result.last);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [LastLoadedPage]);

  useEffect(() => {
    if (id) {
      fetchProviderProducts(Number.parseInt(id), 0, 8).then((result) => {
        setProducts(result.content);
        setIsLastPage(result.last);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Reload]);

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
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/provider/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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
              {Provider && Provider.productsDiscount > 0 && (
                <CardContent className="flex flex-row gap-2">
                  <h3 className="text-xl font-semibold">
                    Descuento actual:{" "}
                    <span className="text-destructive text-2xl">
                      %{Provider.productsDiscount}
                    </span>
                  </h3>
                </CardContent>
              )}
              <CardContent>
                <UpdateProvider
                  provider={Provider}
                  setReload={setReload}
                  Reload={Reload}
                />
                <UpdatePriceProvider
                  provider={Provider}
                  setReload={setReload}
                  Reload={Reload}
                />
{/*                 <UpdateDiscountProvider
                  provider={Provider}
                  setReload={setReload}
                  Reload={Reload}
                /> */}
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
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/6">ID</TableHead>
                      <TableHead className="w-1/3">Nombre</TableHead>
                      <TableHead className="w-1/5">Stock</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead className="w-1/12">Descuento</TableHead>
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
                              ` (${
                                Math.round(
                                  (product.measurePerSaleUnit * product.stock +
                                    Number.EPSILON) *
                                    100
                                ) / 100
                              } ${product.measureType})`}
                          </TableCell>
                          <TableCell>
                            {product.discountPercentage > 0
                              ? `$${product.discountedPrice} / ${product.saleUnit}`
                              : `$${product.saleUnitPrice} / ${product.saleUnit}`}
                          </TableCell>
                          <TableCell>
                            {product.discountPercentage > 0
                              ? `${product.discountPercentage}%`
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {!IsLastPage && (
                  <div className="w-full flex justify-center">
                    <Button
                      onClick={() => {
                        setLastLoadedPage(LastLoadedPage + 1);
                      }}
                    >
                      <Plus />
                      Cargar más
                    </Button>
                  </div>
                )}
              </>
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
