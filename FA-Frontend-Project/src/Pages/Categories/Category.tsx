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
import { AlertCircle } from "lucide-react";

interface Product {
  id: number;
  name: string;
  stock: number;
  saleUnit: string;
  unitPerBox: number;
  price: number;
}
interface Category {
  id: number;
  name: string;
  productsAmount: number;
}

const Category = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { BASE_URL } = useCatalogContext();
  const { getToken } = useKindeAuth();
  const [Category, setCategory] = useState<Category | null>(null);
  const [Products, setProducts] = useState<Array<Product> | null>([]);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/category/${id}`);
        if (!response.ok) {
          console.error("Error fetching Category: ", response.statusText);
          return;
        }
        const result: Category = await response.json();
        setCategory(result);
      } catch (error) {
        console.error("Error fetching Category: ", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/category/${id}/products`);
        if (!response.ok) {
          console.error("Error fetching Category: ", response.statusText);
          toast({
            variant: "destructive",
            title: `Error ${response.status}`,
            description: `Ocurrió un error al obtener los productos de la categoría.`,
          });
          return;
        }
        const result: Array<Product> = await response.json();
        setProducts(result);
      } catch (error) {
        console.error("Error fetching Provider: ", error);
      }
    };
    fetchCategory();
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, BASE_URL]);

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
                <Button className="w-full mb-2">Editar</Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={onDeletePres}
                >
                  Eliminar
                </Button>
              </CardContent>
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
                  {Products?.map((product: Product, i: number) => {
                    return (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          {product.id}
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          {product.stock} Cajas (
                          {product.stock * product.unitPerBox}{" "}
                          {product.saleUnit})
                        </TableCell>
                        <TableCell>${product.price}</TableCell>
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
