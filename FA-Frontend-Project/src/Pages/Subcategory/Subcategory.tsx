import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToastAction } from "@/components/ui/toast";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import {
  StockProduct,
  Subcategory as SubcategoryInterface,
} from "@/hooks/CatalogInterfaces";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { AlertCircle, CircleX, Loader2, Pencil, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe contar con al menos 3 caracteres.",
  }),
});

export const Subcategory = () => {
  const { id } = useParams();
  const {
    fetchSubcategoryById,
    fetchSubcategoryProducts,
    BASE_URL,
    fetchSubcategories,
  } = useCatalogContext();
  const navigate = useNavigate();
  const { getToken } = useKindeAuth();
  const [Loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [Subcategory, setSubcategory] = useState<SubcategoryInterface | null>(
    null
  );
  const [Open, setOpen] = useState(false);
  const [LoadingRequest, setLoadingRequest] = useState(false);
  const [Products, setProducts] = useState<Array<StockProduct> | null>([]);
  const [LastLoadedPage, setLastLoadedPage] = useState(0);
  const [IsLastPage, setIsLastPage] = useState(false);

  const updateSubcategory = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      try {
        if (!getToken) {
          console.error("getToken is undefined");
          return;
        }
        const accessToken = await getToken();
        setLoadingRequest(true);
        const response = await fetch(
          `${BASE_URL}/category/subcategory?name=${data.name}&subcategoryId=${id}`,
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
            description: `Ocurrió un error al actualizar la subcategoría.`,
          });
          return;
        }
        fetchSubcategories();
        toast({
          title: "Categoría actualizada",
          description: "La subcategoría ha sido actualizada con éxito",
        });
      } catch (error) {
        console.error("Error: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al actualizar la subcategoría",
        });
      } finally {
        setLoadingRequest(false);
        setOpen(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (id) {
      fetchSubcategoryById(Number.parseInt(id))
        .then((result) => {
          if (!result) {
            navigate(-1);
          }
          setSubcategory(result ?? null);
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, BASE_URL, Open]);

  useEffect(() => {
    if (id) {
      fetchSubcategoryProducts(Number.parseInt(id), LastLoadedPage, 8).then(
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

  const onDeletePres = () => {
    if (Subcategory && Subcategory?.productsAmount > 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La subcategoría tiene productos asociados.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Confirmación",
        description: "¿Desea eliminar la subcategoría?",
        action: (
          <ToastAction altText="Eliminar" onClick={deleteSubcategory}>
            Eliminar
          </ToastAction>
        ),
      });
    }
  };

  const deleteSubcategory = async () => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/category/subcategory/${id}`, {
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
          description: `Ocurrió un error al eliminar la subcategoría.`,
        });
        return;
      }
      fetchSubcategories();
      toast({
        title: "Subcategoría eliminada",
        description: "La subcategoría ha sido eliminada con éxito",
      });
      navigate(`/catalog/categories/${Subcategory?.categoryId}`);
    } catch (error) {
      console.error("Error: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al eliminar la subcategoría",
      });
    }
  };

  return (
    <div className="CatalogPage SubcategoryPage h-full">
      {Loading || !Subcategory ? (
        <div className="loading w-1/5 h-1/5">
          <h1 className="text-xl">Cargando...</h1>
          <Skeleton className="h-4 w-[100px]" />
        </div>
      ) : Subcategory ? (
        <section className="CatalogPageData h-full w-full">
          <div className="CatalogPageInfo h-2/3 w-1/3">
            <Card className="w-5/6">
              <CardHeader>
                <CardDescription className="text-xl">
                  Subcategoría
                </CardDescription>
                <CardTitle className="text-4xl">{Subcategory.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Cantidad de productos: {Subcategory.productsAmount}
                </CardDescription>
              </CardContent>
              <CardContent>
                <Dialog open={Open} onOpenChange={setOpen}>
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
                        Editar Subcategoría
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(updateSubcategory)}
                        className="w-2/3 space-y-6"
                      >
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nombre de la subcategoría"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={LoadingRequest}>
                          {LoadingRequest && (
                            <Loader2 className="animate-spin" />
                          )}
                          Guardar
                        </Button>
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
          <div className="CatalogPageList w-2/3">
            <h2 className="text-xl text-muted-foreground text-left pb-5">
              Lista de productos
            </h2>
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
                  La subcategoría no tiene productos asociados.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
};
