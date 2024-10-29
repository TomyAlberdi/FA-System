import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { CategoriesHeader } from "@/Pages/Categories/CategoriesHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
interface Category {
  id: number;
  name: string;
  productsAmount: number;
}

export const Categories = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { BASE_URL } = useCatalogContext();

  const [Data, setData] = useState<Array<Category> | null>([]);
  const [Loading, setLoading] = useState<boolean>(true);

  const [UpdateData, setUpdateData] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/category`);
        if (!response.ok) {
          console.error("Error fetching data: ", response.statusText);
          return;
        }
        const result: Array<Category> = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [BASE_URL, UpdateData]);

  return (
    <div className="Categories">
      <CategoriesHeader setUpdateData={setUpdateData} UpdateData={UpdateData} />
      <section className="listBody">
        {Loading ? (
          Array.from({ length: 9 }, (_, i) => {
            return isDesktop ? (
              <Skeleton
                className="skeletonCard h-[150px] w-[19.2%] min-w-[300px] max-w-[400px]"
                key={i}
              />
            ) : (
              <Skeleton className="skeletonCard h-[150px] w-full" key={i} />
            );
          })
        ) : Data?.length == 0 ? (
          <Alert variant="destructive" className="w-auto">
            <AlertCircle className="w-5 pt-1" />
            <AlertTitle className="text-xl">Error</AlertTitle>
            <AlertDescription className="text-lg">
              No se encontraron categorías.
            </AlertDescription>
          </Alert>
        ) : (
          Data?.map((category: Category) => {
            return isDesktop ? (
              <Button asChild key={category.id} className="buttonCard h-[150px] w-[19.2%] min-w-[300px] max-w-[400px]">
                <Link to={`/catalog/categories/${category.id}`}>
                  <h1 className="text-2xl">{category.name}</h1>
                  <h3 className="text-lg">Productos: {category.productsAmount}</h3>
                </Link>
              </Button>
            ) : (
              <Button asChild key={category.id} className="buttonCard h-[150px] w-full">
                <Link to={`/catalog/categories/${category.id}`}>
                  <h1 className="text-2xl">{category.name}</h1>
                  <h3 className="text-lg">Productos: {category.productsAmount}</h3>
                </Link>
              </Button>
            );
          })
        )}
      </section>
    </div>
  );
};
