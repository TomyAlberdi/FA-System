import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { CatalogContext } from "@/Context/CatalogContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useContext, useEffect, useState } from "react";
import { AlertCircle } from "lucide-react"

interface Category {
  id: number;
  name: string;
  productsAmount: number;
}

export const Categories = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { BASE_URL } = useContext(CatalogContext);

  const [Data, setData] = useState<Array<Category> | null>([]);
  const [Loading, setLoading] = useState<boolean>(false);
  const [Error, setError] = useState<string | null>(null);

  useEffect(() => {});

  return (
    <div className="Categories">
      <h1 className="sectionTitle">Categorías</h1>
      <section className="listBody">
        {Loading ? (
          Array.from({ length: 9 }, () => {
            return isDesktop ? (
              <Skeleton className="skeletonCard h-[150px] w-[19.2%] min-w-[300px] max-w-[400px]" />
            ) : (
              <Skeleton className="skeletonCard h-[150px] w-full" />
            );
          })
        ) : Data?.length == 0 ? (
          <Alert variant="destructive" className="w-auto">
            <AlertCircle className="w-5 pt-1" /> 
            <AlertTitle className="text-xl">
              Error
            </AlertTitle>
            <AlertDescription className="text-lg">
              No se encontraron categorías.
            </AlertDescription>
          </Alert>
        ) : null}
      </section>
    </div>
  );
};
