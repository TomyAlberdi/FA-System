import { useCatalogContext } from "@/Context/UseCatalogContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useEffect, useState } from "react";
import { ProvidersHeader } from "./ProvidersHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Provider {
  id: number;
  name: string;
  productsAmount: number;
}

export const Providers = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { BASE_URL } = useCatalogContext();
  const [Data, setData] = useState<Array<Provider> | null>([]);
  const [Loading, setLoading] = useState<boolean>(true);
  const [UpdateData, setUpdateData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/provider`);
        if (!response.ok) {
          console.error("Error fetching data: ", response.statusText);
          return;
        }
        const result: Array<Provider> = await response.json();
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
    <div className="Providers">
      <ProvidersHeader setUpdateData={setUpdateData} UpdateData={UpdateData} />
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
              No se encontraron proveedores.
            </AlertDescription>
          </Alert>
        ) : (
          Data?.map((provider: Provider) => {
            return isDesktop ? (
              <Button
                asChild
                key={provider.id}
                className="buttonCard h-[150px] w-[19.2%] min-w-[300px] max-w-[400px]"
              >
                <Link to={`/catalog/providers/${provider.id}`}>
                  <h1 className="text-2xl">{provider.name}</h1>
                  <h3 className="text-lg">
                    Productos: {provider.productsAmount}
                  </h3>
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                key={provider.id}
                className="buttonCard h-[150px] w-full"
              >
                <Link to={`/catalog/providers/${provider.id}`}>
                  <h1 className="text-2xl">{provider.name}</h1>
                  <h3 className="text-lg">
                    Productos: {provider.productsAmount}
                  </h3>
                </Link>
              </Button>
            );
          })
        )}
      </section>
    </div>
  );
};
