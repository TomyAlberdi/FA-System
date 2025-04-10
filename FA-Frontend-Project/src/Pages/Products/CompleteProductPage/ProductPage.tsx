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
            navigate(-1);
          }
          setProduct(result ?? null);
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, ReloadProduct]);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {Loading ? (
        <>
          <div className="w-full h-[30vh] flex flex-row gap-4">
            <Skeleton className="w-1/4 h-full" />
            <Skeleton className="w-3/4 h-full" />
          </div>
          <div className="w-full h-[58vh] flex flex-row gap-4">
            <Skeleton className="h-full w-1/4" />
            <Skeleton className="h-full w-3/4" />
          </div>
        </>
      ) : (
        <>
          <div className="w-full h-[30vh] flex flex-row gap-4">
            <ProductCarousel Product={Product} />
            <ProductMainInfo Product={Product} />
          </div>
          <div className="w-full min-h-[58vh] flex flex-row gap-4">
            <ProductPageAdminPanel
              Product={Product}
              ReloadProduct={ReloadProduct}
              setReloadProduct={setReloadProduct}
            />
            <ProductComplementaryInfo Product={Product} />
          </div>
        </>
      )}
    </div>
  );
};
