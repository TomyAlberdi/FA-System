import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

interface Category {
  id: number;
  name: string;
  productsAmount: number;
}

const Category = () => {
  const { id } = useParams();

  const { BASE_URL } = useCatalogContext();

  const [Category, setCategory] = useState<Category | null>(null);
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
    fetchCategory();
  }, [id, BASE_URL]);

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
                <Button className="w-full mb-2">
                  Editar
                </Button>
                <Button variant="destructive" className="w-full">
                  Eliminar
                </Button>
              </CardContent>
            </Card>
          </div>
          <ScrollArea className="CatalogPageList w-2/3">
            <h2 className="text-xl text-muted-foreground text-left pb-5">
              Lista de productos
            </h2>
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
                {Array.from({ length: 5 }, (_, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell className="font-medium">123</TableCell>
                      <TableCell>Producto</TableCell>
                      <TableCell>10 Cajas (100m2)</TableCell>
                      <TableCell>$100</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </section>
      ) : null}
    </div>
  );
};
export default Category;
