import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Category as CategoryInterface,
  StockProduct,
} from "@/hooks/CatalogInterfaces";
import { Label } from "@/components/ui/label";

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

  const [Name, setName] = useState<string>("");

  const [SubcategoryName, setSubcategoryName] = useState<string>("");

  async function updateCategory() {
    setLoadingRequest(true);
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(
        `${BASE_URL}/category?name=${Name}&id=${id}`,
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
  }

  async function createSubcategory() {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      setLoadingRequest(true);
      const response = await fetch(
        `${BASE_URL}/category/subcategory?name=${SubcategoryName}&categoryId=${id}`,
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
  }

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
    <div className="h-full flex md:flex-row flex-col justify-center items-start">
      {Loading || !Category ? (
        <div className="loading md:w-1/5 h-1/5 w-[75%]">
          <h1 className="text-xl">Cargando...</h1>
          <Skeleton className="h-4 w-[100px]" />
        </div>
      ) : Category ? (
        <>
          <Card className="md:w-1/3 md:mr-5 mr-0 w-full">
            <CardHeader>
              <CardDescription className="text-xl">Categoría</CardDescription>
              <CardTitle className="md:text-4xl text-3xl">{Category.name}</CardTitle>
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
                  className="md:w-full w-[90%] md:p-6 p-3 rounded-lg"
                  aria-describedby={undefined}
                >
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      Editar Categoría
                    </DialogTitle>
                  </DialogHeader>
                  <div className="w-full flex flex-col gap-4">
                    <Label>Nombre</Label>
                    <Input
                      placeholder="Nombre de la categoría"
                      onChange={(e) => setName(e.target.value)}
                      defaultValue={Category?.name ?? ""}
                    />
                    <Button
                      onClick={updateCategory}
                      disabled={LoadingRequest}
                      className="w-full"
                    >
                      {LoadingRequest && <Loader2 className="animate-spin" />}
                      Guardar
                    </Button>
                  </div>
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
                <DialogContent className="p-6" aria-describedby={undefined}>
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      Añadir subcategoría
                    </DialogTitle>
                  </DialogHeader>
                  <div className="w-full flex flex-col gap-4">
                    <Label>Nombre</Label>
                    <Input
                      placeholder="Nombre de la categoría"
                      onChange={(e) => setSubcategoryName(e.target.value)}
                    />
                    <Button
                      onClick={createSubcategory}
                      disabled={LoadingRequest}
                      className="w-full"
                    >
                      {LoadingRequest && <Loader2 className="animate-spin" />}
                      Guardar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
            {Category.subcategories.length > 0 && (
              <CardContent>
                <CardTitle>Subcategorías</CardTitle>
                <ScrollArea className="md:max-h-20rem max-h-auto">
                  <Table>
                    <TableCaption>Subcategorías</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/12">ID</TableHead>
                        <TableHead className="w-1/2">Nombre</TableHead>
                        <TableHead className="w-1/10">№ de productos</TableHead>
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
          <ScrollArea className="h-[88vh] w-2/3 ">
          {/* FIXME: Product list overflowing viewport width */}
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
        </>
      ) : null}
    </div>
  );
};

export default Category;
