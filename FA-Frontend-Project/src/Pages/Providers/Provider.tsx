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
import { AlertCircle } from "lucide-react";

interface Product {
  id: number;
  name: string;
  stock: number;
  saleUnit: string;
  unitPerBox: number;
  price: number;
}

interface Provider {
  id: number;
  name: string;
  productsAmount: number;
}

export const Provider = () => {
  const { id } = useParams();
  const { BASE_URL } = useCatalogContext();
  const [Provider, setProvider] = useState<Provider | null>(null);
  const [Products, setProducts] = useState<Array<Product> | null>([]);
  const [Loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { getToken } = useKindeAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProvider = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/provider/${id}`);
        if (!response.ok) {
          console.error("Error fetching Provider: ", response.statusText);
          toast({
            variant: "destructive",
            title: `Error ${response.status}`,
            description: `Ocurrió un error al obtener el proveedor.`,
          });
          return;
        }
        const result: Provider = await response.json();
        setProvider(result);
      } catch (error) {
        console.error("Error fetching Provider: ", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/provider/${id}/products`);
        if (!response.ok) {
          console.error("Error fetching Provider products: ", response.statusText);
          toast({
            variant: "destructive",
            title: `Error ${response.status}`,
            description: `Ocurrió un error al obtener los productos del proveedor.`,
          });
          return;
        }
        const result: Array<Product> = await response.json();
        setProducts(result);
      } catch (error) {
        console.error("Error fetching Provider products: ", error);
      }
    };
    fetchProvider();
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, BASE_URL]);

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
                  Cantidad de productos: {Provider.productsAmount}
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
