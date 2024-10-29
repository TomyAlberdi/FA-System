import { Skeleton } from "@/components/ui/skeleton";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Provider {
  id: number;
  name: string;
  productsAmount: number;
}

export const Provider = () => {

  const { id } = useParams();
  const { BASE_URL } = useCatalogContext();
  const [Data, setData] = useState<Provider | null>(null);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/provider/${id}`);
        if (!response.ok) {
          console.error("Error fetching data: ", response.statusText);
          return;
        }
        const result: Provider = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, BASE_URL]);

  return (
    <div className="CatalogPage ProviderPage h-full">
      {
        Loading ? (
          <div className="loading w-1/5 h-1/5">
            <h1 className="text-xl">Cargando...</h1>
            <Skeleton className="h-4 w-[100px]" />
          </div>
        ) : Data ? (
          <section className="CatalogPageData h-full w-full">
            <h1>{Data.name}</h1>
          </section>
        ) : (
          <h1>Error</h1>
        )
      }
    </div>
  )
}