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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useCategoryContext } from "@/Context/Category/UseCategoryContext";
import { useSubcategoryContext } from "@/Context/Subcategory/UseSubcategoryContext";
import {
  Category as CategoryInterface,
  StockProduct,
} from "@/hooks/CatalogInterfaces";
import AddSubcategory from "@/Pages/Categories/AddSubcategory";
import Subcategories from "@/Pages/Categories/Subcategories";
import {
  AlertCircle,
  CirclePlus,
  CircleX,
  Loader2,
  Pencil,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Category = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    fetchCategory,
    updateCategory,
    deleteCategory,
    fetchCategoryProducts,
    fetchCategories,
  } = useCategoryContext();
  const { createSubcategory } = useSubcategoryContext();
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

  const onSubmitUpdate = () => {
    if (Name === "") {
      window.alert("El nombre de la categoría no puede estar vacío.");
      return;
    }
    submitUpdateCategory(Name);
  };

  const submitUpdateCategory = async (name: string) => {
    setLoadingRequest(true);
    try {
      await updateCategory(Number(id), name);
      window.alert("Categoría actualizada con éxito");
      await fetchCategories();
      await loadCategory();
      setOpen(false);
    } catch (error) {
      console.error("Error: ", error);
      window.alert("Ocurrió un error al actualizar la categoría");
    } finally {
      setLoadingRequest(false);
    }
  };

  const onSubmitSubcategory = () => {
    if (SubcategoryName === "") {
      window.alert("El nombre de la subcategoría no puede estar vacío.");
      return;
    }
    submitSubcategory(SubcategoryName);
  };

  const submitSubcategory = async (name: string) => {
    setLoadingRequest(true);
    try {
      await createSubcategory(Number(id), name);
      setOpenCreateSubcategory(false);
      window.alert("Subcategoría creada con éxito");
      await loadCategory();
    } catch (error) {
      console.error("Error: ", error);
      window.alert("Ocurrió un error al crear la subcategoría");
    } finally {
      setLoadingRequest(false);
    }
  };

  const loadCategory = async () => {
    if (id) {
      await fetchCategory(Number.parseInt(id))
        .then((result) => {
          if (!result) {
            navigate(-1);
          }
          setCategory(result ?? null);
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  const onSubmitDelete = () => {
    if (Category && Category?.productsAmount > 0) {
      window.alert("La categoría tiene productos asociados.");
    } else {
      if (window.confirm("¿Desea eliminar la categoría?")) {
        submitDeleteCategory();
      }
    }
  };

  const submitDeleteCategory = async () => {
    try {
      setLoadingRequest(true);
      await deleteCategory(Number(id));
      window.alert("Categoría eliminada con éxito");
      await fetchCategories();
      navigate(-1);
    } catch (error) {
      console.error("Error: ", error);
      window.alert("Ocurrió un error al eliminar la categoría");
    } finally {
      setLoadingRequest(false);
    }
  };

  return (
    <div className="h-full flex md:flex-row flex-col justify-start items-start">
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
              <CardTitle className="md:text-4xl text-3xl">
                {Category.name}
              </CardTitle>
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
                      onChange={(e) => setName(e.target.value)}
                      placeholder={Category?.name ?? ""}
                    />
                    <Button
                      onClick={onSubmitUpdate}
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
                onClick={onSubmitDelete}
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
                <AddSubcategory
                  LoadingRequest={LoadingRequest}
                  setSubcategoryName={setSubcategoryName}
                  onSubmitSubcategory={onSubmitSubcategory}
                />
              </Dialog>
            </CardContent>
            {Category.subcategories.length > 0 && (
              <Subcategories category={Category} />
            )}
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
