import { useCatalogContext } from "@/Context/UseCatalogContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useEffect, useState } from "react";
import { ProvidersHeader } from "@/Pages/Providers/ProvidersHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Provider } from "@/hooks/CatalogInterfaces";

export const Providers = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { fetchProviders } = useCatalogContext();
  const [Data, setData] = useState<Array<Provider>>([]);
  const [Loading, setLoading] = useState<boolean>(true);
  const [UpdateData, setUpdateData] = useState(false);

  useEffect(() => {
    fetchProviders()
      .then((result) => setData(result ?? []))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UpdateData]);

  return (
    <div className="Providers">
      <ProvidersHeader setUpdateData={setUpdateData} UpdateData={UpdateData} />
      <section className="listBody">
        {Loading ? (
          Array.from({ length: 9 }, (_, i) => {
            return isDesktop ? (
              <Skeleton
                className="skeletonCard h-[100px] w-[19.2%] min-w-[300px] max-w-[400px]"
                key={i}
              />
            ) : (
              <Skeleton className="skeletonCard h-[100px] w-full" key={i} />
            );
          })
        ) : !Loading && Data.length === 0 ? (
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
                className="buttonCard h-[100px] w-[19.2%] min-w-[300px] max-w-[400px]"
              >
                <Link to={`/catalog/providers/${provider.id}`}>
                  <h1 className="text-2xl">{provider.name}</h1>
                  <h3 className="text-lg font-light">
                    Productos: {provider.productsAmount}
                  </h3>
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                key={provider.id}
                className="buttonCard h-[100px] w-full"
              >
                <Link to={`/catalog/providers/${provider.id}`}>
                  <h1 className="text-2xl">{provider.name}</h1>
                  <h3 className="text-lg font-light">
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
