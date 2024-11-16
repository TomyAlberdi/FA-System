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
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader
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

const formSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe contar con al menos 3 caracteres.",
  }),
});

const Category = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { BASE_URL, fetchCategory, fetchCategoryProducts } =
    useCatalogContext();
  const { getToken } = useKindeAuth();
  const [Category, setCategory] = useState<CategoryInterface | null>(null);
  const [Products, setProducts] = useState<Array<StockProduct> | null>([]);
  const [Loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const updateCategory = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      if (typeof getToken === "function") {
        const token = await getToken();
        try {
          const response = await fetch(
            `${BASE_URL}/category?name=${data.name}&id=${id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
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
        } catch (error) {
          console.error("Error: ", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Ocurrió un error al actualizar la categoría",
          });
        } finally {
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
    },
  });

  useEffect(() => {
    if (id) {
      fetchCategory(Number.parseInt(id))
        .then((result) => setCategory(result ?? null))
        .finally(() => setLoading(false));
      fetchCategoryProducts(Number.parseInt(id)).then((result) =>
        setProducts(result ?? null)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, BASE_URL, open]);

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
    if (typeof getToken === "function") {
      const token = await getToken();
      try {
        const response = await fetch(`${BASE_URL}/category/${id}`, {
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
            description: `Ocurrió un error al eliminar la categoría.`,
          });
          return;
        }
        toast({
          title: "Categoría eliminada",
          description: "La categoría ha sido eliminada con éxito",
        });
        navigate("/catalog/categories");
      } catch (error) {
        console.error("Error: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al eliminar la categoría",
        });
      }
    } else return;
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
                    <Button className="w-full mb-2">Editar</Button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-[500px] w-full"
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
                        <Button type="submit">Guardar</Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={onDeletePres}
                >
                  Eliminar
                </Button>
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
                                navigate(
                                  `/catalog/categories/subcategory/${item.id}`
                                )
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
                      <TableRow key={i} className={product.disabled ? "cursor-pointer opacity-50 text-red-700" : "cursor-pointer"}>
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
                          ${product.saleUnitPrice} x {product.saleUnit}
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
