import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProviderContext } from "@/Context/Provider/UseProviderContext";
import { Provider } from "@/hooks/CatalogInterfaces";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ProvidersHeader } from "@/Pages/Providers/ProvidersHeader";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Providers = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { fetchProviders } = useProviderContext();
  const [Providers, setProviders] = useState<Provider[]>([]);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await fetchProviders();
      setProviders(result);
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Providers">
      <ProvidersHeader />
      <section className="listBody md:gap-[1%]">
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
        ) : Providers.length === 0 ? (
          <Alert variant="destructive" className="md:w-auto w-full">
            <AlertCircle className="w-5 pt-1" />
            <AlertTitle className="text-xl">Error</AlertTitle>
            <AlertDescription className="text-lg">
              No se encontraron proveedores.
            </AlertDescription>
          </Alert>
        ) : (
          Providers.map((provider: Provider) => {
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
