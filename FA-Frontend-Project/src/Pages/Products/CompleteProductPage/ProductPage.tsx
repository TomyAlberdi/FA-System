import { Skeleton } from "@/components/ui/skeleton";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { CompleteProduct } from "@/hooks/CatalogInterfaces";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductPageAdminPanel } from "@/Pages/Products/CompleteProductPage/ProductAdminPanel";
import { ProductCarousel } from "@/Pages/Products/CompleteProductPage/ProductCarousel";
import { ProductMainInfo } from "@/Pages/Products/CompleteProductPage/ProductMainInfo";
import { ProductComplementaryInfo } from "@/Pages/Products/CompleteProductPage/ProductComplementaryInfo";

export const ProductPage = () => {
  const { id } = useParams();
  const { fetchProduct } = useCatalogContext();

  const [Loading, setLoading] = useState(true);
  const [Product, setProduct] = useState<CompleteProduct | null>(null);

  const [ReloadProduct, setReloadProduct] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchProduct(Number.parseInt(id))
        .then((result) => {
          if (!result) {
            navigate(-1)
          }
          setProduct(result ?? null)
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, ReloadProduct]);

  return (
    <div className="ProductPage w-full h-full">
      {Loading ? (
        <>
          <Skeleton className="row-start-1 row-end-7 col-start-1 col-end-5" />
          <Skeleton className="row-start-1 row-end-7 col-start-5 col-end-16" />
          <Skeleton className="row-start-7 row-end-16 col-start-1 col-end-5" />
          <Skeleton className="row-start-7 row-end-16 col-start-5 col-end-16" /> 
        </>
      ) : (
        <>
          <ProductCarousel Product={Product} />
          <ProductMainInfo Product={Product} />
          <ProductPageAdminPanel Product={Product} ReloadProduct={ReloadProduct} setReloadProduct={setReloadProduct} />
          <ProductComplementaryInfo Product={Product} />
        </>
      )}
    </div>
  );
};
