import { useCatalogContext } from "@/Context/UseCatalogContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ProvidersHeader } from "@/Pages/Providers/ProvidersHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Provider } from "@/hooks/CatalogInterfaces";

export const Providers = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { Providers: Data } = useCatalogContext();

  return (
    <div className="Providers">
      <ProvidersHeader />
      <section className="listBody">
        {Data?.Loading ? (
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
        ) : Array.isArray(Data?.data) && Data?.data?.length === 0 ? (
          <Alert variant="destructive" className="w-auto">
            <AlertCircle className="w-5 pt-1" />
            <AlertTitle className="text-xl">Error</AlertTitle>
            <AlertDescription className="text-lg">
              No se encontraron proveedores.
            </AlertDescription>
          </Alert>
        ) : (
          Array.isArray(Data?.data) &&
          (Data?.data as Provider[]).map((provider: Provider) => {
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
