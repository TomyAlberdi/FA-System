import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { ProductStock } from "@/hooks/CatalogInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export const StockList = () => {

  const { fetchStockList } = useCatalogContext();
  const { getToken } = useKindeAuth();

  const [Data, setData] = useState<Array<ProductStock> | null>(null);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    if (getToken) {
      fetchStockList()
        .then((result) => setData(result ?? null))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="StockList">
      {
        Loading ? (
          <>
            <span>cargando</span>
          </>
        ) : Data?.length === 0 ? (
          <Alert variant="destructive" className="w-auto">
          <AlertCircle className="w-5 pt-1" />
          <AlertTitle className="text-xl">Error</AlertTitle>
          <AlertDescription className="text-lg">
            Error al obtener el stock de los productos.
          </AlertDescription>
        </Alert>
        ) : (
          <>
            
          </>
        )
      }
    </div>
  )
}