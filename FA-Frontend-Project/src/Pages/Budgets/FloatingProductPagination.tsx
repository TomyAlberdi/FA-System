import { ProductCard } from "@/Pages/Budgets/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { CardProduct } from "@/hooks/CatalogInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface FloatingProductPaginationProps {
  handleAddProduct: (
    product: CardProduct,
    measureUnitQuantity: number,
    saleUnitQuantity: number,
    discountPercentage: number,
    subtotal: number
  ) => void;
}

export const FloatingProductPagination = ({
  handleAddProduct,
}: FloatingProductPaginationProps) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { getToken } = useKindeAuth();

  const [Products, setProducts] = useState<Array<CardProduct>>([]);
  const [LastLoadedPage, setLastLoadedPage] = useState(0);
  const [IsLastPage, setIsLastPage] = useState(false);
  const [Keyword, setKeyword] = useState("");
  const [Loading, setLoading] = useState(true);

  const fetchProducts = async (keyword: string) => {
    setLoading(true);
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const url = `${BASE_URL}/product/search?page=${LastLoadedPage}&size=10&keyword=${keyword}`;
      const accessToken = await getToken();
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching products: ", response.status);
        window.alert(`Error buscando productos: ${response.status}`);
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

  useEffect(() => {
    fetchProducts(Keyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [LastLoadedPage]);

  return (
    <ScrollArea className="w-full h-full">
      {Loading ? (
        <div className="w-full h-full flex md:flex-row flex-col flex-wrap justify-between">
          {Array.from({ length: 10 }, (_, i) => {
            return (
              <Skeleton
                key={i}
                className="md:w-[19.2%] w-full mb-3 h-[375px]"
              />
            );
          })}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center">
          <div className="w-full pb-2 flex flex-row items-center">
            <Input
              placeholder="Buscar por nombre, código o descripción"
              type="text"
              className="md:w-1/3 w-full text-lg"
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button onClick={() => fetchProducts(Keyword)} className="ml-2">
              <Search className="bigger-icon" />
            </Button>
          </div>
          <div className="w-full h-full flex md:flex-row flex-col flex-wrap justify-left gap-3">
            {Products?.map((product: CardProduct, i: number) => {
              return (
                <ProductCard
                  key={i}
                  product={product}
                  handleAddProduct={handleAddProduct}
                />
              );
            })}
          </div>
          {!IsLastPage && (
            <div className="flex justify-center align-center mt-2">
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
