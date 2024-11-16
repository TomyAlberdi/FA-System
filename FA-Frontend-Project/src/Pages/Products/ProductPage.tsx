import { useCatalogContext } from "@/Context/UseCatalogContext";
import { CompleteProduct } from "@/hooks/CatalogInterfaces";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const ProductPage = () => {

  const { id } = useParams();
  const { fetchProduct } = useCatalogContext();

  const [Loading, setLoading] = useState(true);
  const [Product, setProduct] = useState<CompleteProduct | null>(null);

  useEffect(() => {
    if (id) {
      fetchProduct(Number.parseInt(id))
        .then((result) => setProduct(result ?? null))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div>{Product?.name}</div>
  )
}