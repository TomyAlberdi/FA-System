import { Skeleton } from "@/components/ui/skeleton";
import { useProductContext } from "@/Context/Product/UseProductContext";
import { CompleteProduct } from "@/hooks/CatalogInterfaces";
import { ProductPageAdminPanel } from "@/Pages/Products/CompleteProductPage/ProductAdminPanel";
import { ProductCarousel } from "@/Pages/Products/CompleteProductPage/ProductCarousel";
import { ProductComplementaryInfo } from "@/Pages/Products/CompleteProductPage/ProductComplementaryInfo";
import { ProductMainInfo } from "@/Pages/Products/CompleteProductPage/ProductMainInfo";
import MobileProductAdminPanel from "@/Pages/Products/Mobile/MobileProductAdminPanel";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const ProductPage = () => {
  const { id } = useParams();
  const { fetchProduct } = useProductContext();

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
    <div className="w-full h-full flex flex-col md:gap-4 gap-2">
      {Loading ? (
        <>
          <div className="w-full md:h-[30vh] h-[60vh] flex md:flex-row flex-col gap-4">
            <Skeleton className="md:w-1/4 w-full h-full" />
            <Skeleton className="md:w-3/4 w-full h-full" />
          </div>
          <div className="w-full md:h-[58vh] h-[28vh] flex md:flex-row flex-col gap-4">
            <Skeleton className="h-full md:w-1/4 w-full" />
            <Skeleton className="h-full md:w-3/4 w-full" />
          </div>
        </>
      ) : (
        <>
          <div className="w-full md:h-[30vh] h-auto flex md:flex-row flex-col md:gap-4 gap-2">
            <ProductCarousel Product={Product} />
            <ProductMainInfo Product={Product} />
          </div>
          <div className="w-full md:min-h-[58vh] h-auto flex md:flex-row flex-col md:gap-4 gap-0">
            <ProductPageAdminPanel
              Product={Product}
              ReloadProduct={ReloadProduct}
              setReloadProduct={setReloadProduct}
            />
            <MobileProductAdminPanel
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
