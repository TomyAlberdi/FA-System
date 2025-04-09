import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
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
import { ToastAction } from "@/components/ui/toast";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CirclePlus,
  CircleX,
  Loader2,
  Pencil,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";
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
  Category as CategoryInterface,
  StockProduct,
} from "@/hooks/CatalogInterfaces";

//FIXME: Migrate from form to regular input
const formSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe contar con al menos 3 caracteres.",
  }),
});

//TODO: Mobile Category Page
const Category = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { BASE_URL, fetchCategory, fetchCategoryProducts, fetchCategories } =
    useCatalogContext();
  const { getToken } = useKindeAuth();
  const [Category, setCategory] = useState<CategoryInterface | null>(null);
  const [Products, setProducts] = useState<Array<StockProduct> | null>([]);
  const [IsLastPage, setIsLastPage] = useState(false);
  const [Loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [LastLoadedPage, setLastLoadedPage] = useState(0);

  const [LoadingRequest, setLoadingRequest] = useState(false);

  const [openCreateSubcategory, setOpenCreateSubcategory] = useState(false);

  const updateCategory = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      setLoadingRequest(true);
      try {
        if (!getToken) {
          console.error("getToken is undefined");
          return;
        }
        const accessToken = await getToken();
        const response = await fetch(
          `${BASE_URL}/category?name=${data.name}&id=${id}`,
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
            description: `Ocurrió un error al actualizar la categoría.`,
          });
          return;
        }
        toast({
          title: "Categoría actualizada",
          description: "La categoría ha sido actualizada con éxito",
        });
        fetchCategories();
      } catch (error) {
        console.error("Error: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al actualizar la categoría",
        });
      } finally {
        setLoadingRequest(false);
        setOpen(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const createSubcategory = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      try {
        if (!getToken) {
          console.error("getToken is undefined");
          return;
        }
        const accessToken = await getToken();
        setLoadingRequest(true);
        const response = await fetch(
          `${BASE_URL}/category/subcategory?name=${data.name}&categoryId=${id}`,
          {
            method: "POST",
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
            description: `Ocurrió un error al crear la subcategoría.`,
          });
          return;
        }
        toast({
          title: "Subcategoría creada",
          description: "La subcategoría ha sido creada con éxito",
        });
        const responseData = await response.json();
        navigate(`/catalog/subcategory/${responseData.id}`);
      } catch (error) {
        console.error("Error: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al crear la subcategoría",
        });
      } finally {
        setOpenCreateSubcategory(false);
        setLoadingRequest(false);
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

  const subcategoryForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (id) {
      fetchCategory(Number.parseInt(id))
        .then((result) => {
          if (!result) {
            navigate(-1);
          }
          setCategory(result ?? null);
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, BASE_URL, open, openCreateSubcategory]);

  useEffect(() => {
    if (id) {
      fetchCategoryProducts(Number.parseInt(id), LastLoadedPage, 8).then(
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
    if (Category && Category?.productsAmount > 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La categoría tiene productos asociados.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Confirmación",
        description: "¿Desea eliminar la categoría?",
        action: (
          <ToastAction altText="Eliminar" onClick={deleteCategory}>
            Eliminar
          </ToastAction>
        ),
      });
    }
  };

  const deleteCategory = async () => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/category/${id}`, {
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
          description: `Ocurrió un error al eliminar la categoría.`,
        });
        return;
      }
      toast({
        title: "Categoría eliminada",
        description: "La categoría ha sido eliminada con éxito",
      });
      fetchCategories();
      navigate("/catalog/categories");
    } catch (error) {
      console.error("Error: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al eliminar la categoría",
      });
    }
  };

  return (
    <div className="CatalogPage CategoryPage h-full">
      {Loading || !Category ? (
        <div className="loading w-1/5 h-1/5">
          <h1 className="text-xl">Cargando...</h1>
          <Skeleton className="h-4 w-[100px]" />
        </div>
      ) : Category ? (
        <section className="CatalogPageData h-full w-full">
          <div className="CatalogPageInfo h-2/3 w-1/3">
            <Card className="w-5/6">
              <CardHeader>
                <CardDescription className="text-xl">Categoría</CardDescription>
                <CardTitle className="text-4xl">{Category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Cantidad de productos: {Category.productsAmount}
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
                    className="sm:max-w-[500px] w-full p-6"
                    aria-describedby={undefined}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">
                        Editar Categoría
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(updateCategory)}
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
                                  placeholder="Nombre de la categoría"
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
                  className="w-full mb-2"
                  onClick={onDeletePres}
                >
                  <CircleX />
                  Eliminar
                </Button>
                <Dialog
                  open={openCreateSubcategory}
                  onOpenChange={setOpenCreateSubcategory}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <CirclePlus />
                      Añadir subcategoría
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="p-6">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">
                        Añadir subcategoría
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...subcategoryForm}>
                      <form
                        onSubmit={form.handleSubmit(createSubcategory)}
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
              </CardContent>
              {Category.subcategories.length > 0 && (
                <CardContent>
                  <CardTitle>Subcategorías</CardTitle>
                  <ScrollArea className="max-h-20rem">
                    <Table>
                      <TableCaption>Subcategorías</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/12">ID</TableHead>
                          <TableHead className="w-1/2">Nombre</TableHead>
                          <TableHead className="w-1/10">
                            № de productos
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Category.subcategories?.map((item, index) => {
                          return (
                            <TableRow
                              className="cursor-pointer"
                              key={index}
                              onClick={() =>
                                navigate(`/catalog/subcategory/${item.id}`)
                              }
                            >
                              <TableCell className="font-medium">
                                {item.id}
                              </TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.productsAmount}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              )}
            </Card>
          </div>
          <ScrollArea className="CatalogPageList w-2/3">
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
                  La categoría no tiene productos asociados.
                </AlertDescription>
              </Alert>
            )}
          </ScrollArea>
        </section>
      ) : null}
    </div>
  );
};

export default Category;
