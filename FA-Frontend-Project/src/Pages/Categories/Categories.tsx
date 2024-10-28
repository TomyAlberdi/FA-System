import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { CategoriesHeader } from "@/Pages/Categories/CategoriesHeader";
interface Category {
  id: number;
  name: string;
  productsAmount: number;
}

export const Categories = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { BASE_URL } = useCatalogContext();
  const token = useKindeAuth().getToken;

  const [Data, setData] = useState<Array<Category> | null>([]);
  const [Loading, setLoading] = useState<boolean>(false);

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
  }, [token, BASE_URL]);

  return (
    <div className="Categories">
      <CategoriesHeader />
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
        ) : null}
      </section>
    </div>
  );
};
