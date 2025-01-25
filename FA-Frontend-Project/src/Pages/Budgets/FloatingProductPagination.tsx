import { ScrollArea } from "@/components/ui/scroll-area";
import { useSalesContext } from "@/Context/UseSalesContext";
import { useToast } from "@/hooks/use-toast";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useEffect, useState } from "react";
import { ProductCard } from "@/Pages/Budgets/ProductCard";
import { CardProduct } from "@/hooks/CatalogInterfaces";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FloatingProductPaginationProps {
  setOpen: (value: boolean) => void;
}

export const FloatingProductPagination = ({
  setOpen,
}: FloatingProductPaginationProps) => {
  const { BASE_URL } = useSalesContext();
  const { getToken } = useKindeAuth();
  const { toast } = useToast();

  const [Products, setProducts] = useState<Array<CardProduct>>([]);
  const [LastLoadedPage, setLastLoadedPage] = useState(0);
  const [IsLastPage, setIsLastPage] = useState(false);
  const [Keyword, setKeyword] = useState("");
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (!getToken) {
          console.error("getToken is undefined");
          return;
        }
        let url = `${BASE_URL}/product/search?page=${LastLoadedPage}&size=10`;
        if (Keyword.length > 0) {
          url += `&keyword=${Keyword}`;
        }
        const accessToken = await getToken();
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          console.error("Error fetching products: ", response.status);
          return;
        }
        const result = await response.json();
        const newProducts = result.content;
        setProducts((prevProducts) => {
          if (LastLoadedPage === 0) {
            return newProducts;
          }
          const existingIds = prevProducts.map((product) => product.id);
          const filteredNewProducts = newProducts.filter(
            (product: CardProduct) => !existingIds.includes(product.id)
          );
          return [...prevProducts, ...filteredNewProducts];
        });
        setIsLastPage(result.last);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [LastLoadedPage]);

  return (
    <ScrollArea className="w-full h-full">
      {Loading ? (
        <div className="w-full h-full flex flex-row flex-wrap justify-between">
          {Array.from({ length: 10 }, (_, i) => {
            return <Skeleton key={i} className="w-[19.2%] mb-3 h-[375px]" />;
          })}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center">
          <div className="w-full h-full flex flex-row flex-wrap justify-left gap-3">
            {Products?.map((product: CardProduct, i: number) => {
              return <ProductCard key={i} product={product} />;
            })}
          </div>
          {!IsLastPage && (
            <div className="flex justify-center align-center">
              <Button
                onClick={() => {
                  setLastLoadedPage(LastLoadedPage + 1);
                }}
              >
                <Plus />
                Cargar más
              </Button>
            </div>
          )}
        </div>
      )}
    </ScrollArea>
  );
};
