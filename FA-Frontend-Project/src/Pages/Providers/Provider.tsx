import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProviderContext } from "@/Context/Provider/UseProviderContext";
import {
  Provider as ProviderInterface,
  StockProduct,
} from "@/hooks/CatalogInterfaces";
import { UpdateProvider } from "@/Pages/Providers/UpdateProvider";
import { AlertCircle, CircleX, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const Provider = () => {
  const { id } = useParams();
  const { fetchProvider, fetchProviderProducts, deleteProvider } =
    useProviderContext();
  const [Provider, setProvider] = useState<ProviderInterface | null>(null);
  const [Products, setProducts] = useState<Array<StockProduct> | null>([]);
  const [LastLoadedPage, setLastLoadedPage] = useState(0);
  const [IsLastPage, setIsLastPage] = useState(false);
  const [Loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await fetchProvider(Number.parseInt(id))
          .then((result) => {
            if (!result) {
              navigate(-1);
            }
            setProvider(result ?? null);
          })
          .finally(() => setLoading(false));
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  const onSubmitDelete = () => {
    if (Provider && Provider.productsAmount > 0) {
      window.alert("El proveedor tiene productos asociados.");
      return;
    }
    if (window.confirm("¿Desea eliminar el proveedor?")) {
      submitDeleteProvider();
    }
  };

  const submitDeleteProvider = async () => {
    await deleteProvider(Number(id));
  };

  return (
    <div className="h-full flex md:flex-row flex-col justify-start items-start">
      {Loading || !Provider ? (
        <div className="loading md:w-1/5 h-1/5 w-[75%]">
          <h1 className="text-xl">Cargando...</h1>
          <Skeleton className="h-4 w-[100px]" />
        </div>
      ) : Provider ? (
        <>
          <Card className="md:w-1/3 md:mr-5 mr-0 w-full">
            <CardHeader>
              <CardDescription className="text-xl">Proveedor</CardDescription>
              <CardTitle className="md:text-4xl text-3xl">
                {Provider.name}
              </CardTitle>
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
            {/*               {Provider && Provider.productsDiscount > 0 && (
                <CardContent className="flex flex-row gap-2">
                  <h3 className="text-xl font-semibold">
                    Descuento actual:{" "}
                    <span className="text-destructive text-2xl">
                      %{Provider.productsDiscount}
                    </span>
                  </h3>
                </CardContent>
              )} */}
            <CardContent>
              <UpdateProvider defaultProvider={Provider} />
              {/*<UpdatePriceProvider
                  provider={Provider}
                  setReload={setReload}
                  Reload={Reload}
                />*/}
              {/*<UpdateDiscountProvider
                  provider={Provider}
                  setReload={setReload}
                  Reload={Reload}
                />*/}
              <Button
                variant="destructive"
                className="w-full"
                onClick={onSubmitDelete}
              >
                <CircleX />
                Eliminar
              </Button>
            </CardContent>
          </Card>
          <ScrollArea className="md:h-[85vh] md:w-2/3 w-full h-auto">
            <h2 className="text-xl text-muted-foreground md:pb-5 md:py-0 py-5 md:text-left text-center w-full">
              Lista de productos
            </h2>
            {Products && Products?.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/12">ID</TableHead>
                      <TableHead className="md:w-4/12 w-11/12">
                        Nombre
                      </TableHead>
                      <TableHead className="w-3/12 hidden md:table-cell">
                        Stock
                      </TableHead>
                      <TableHead className="w-3/12 hidden md:table-cell">
                        Precio
                      </TableHead>
                      <TableHead className="w-1/12 hidden md:table-cell">
                        Descuento
                      </TableHead>
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
                          <TableCell className="hidden md:table-cell">
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
                          <TableCell className="hidden md:table-cell">
                            {product.discountPercentage > 0
                              ? `$${product.discountedPrice} / ${product.saleUnit}`
                              : `$${product.saleUnitPrice} / ${product.saleUnit}`}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
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
        </>
      ) : null}
    </div>
  );
};
