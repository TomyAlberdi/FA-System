import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { CardProduct, PaginationInfo } from "@/hooks/CatalogInterfaces";
import { AlertCircle, CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/Pages/Products/ProductCard";

export const ProductPagination = () => {
  /* Diseñar product card */
  /* Implementar menú pagination */

  const [PaginationDropdownOpen, setPaginationDropdownOpen] = useState(false);
  const [CurrentPage, setCurrentPage] = useState(0);
  const { BASE_URL } = useCatalogContext();
  const [Loading, setLoading] = useState(true);
  const [Products, setProducts] = useState<Array<CardProduct>>([]);
  const [PaginationInfo, setPaginationInfo] = useState<PaginationInfo>();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/product?page=${CurrentPage}&size=12`
        );
        if (!response.ok) {
          console.error("Error fetching data: ", response.statusText);
          return;
        }
        const result = await response.json();
        setProducts(result.content);
        setPaginationInfo({
          pageNumber: result.pageable.pageNumber,
          totalPages: result.totalPages,
          totalElements: result.totalElements,
          first: result.first,
          last: result.last,
        });
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [CurrentPage, BASE_URL]);

  const handlePrev = () => {
    if (CurrentPage > 0) {
      setCurrentPage(CurrentPage - 1);
    }
  };

  const handleNext = () => {
    if (
      PaginationInfo?.totalPages &&
      CurrentPage + 1 < PaginationInfo?.totalPages
    ) {
      setCurrentPage(CurrentPage + 1);
    }
  };

  const handleClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className="ProductPagination col-span-6">
      <section className="listHeader">
        <span></span>
        <Link to={"/catalog/products/add"}>
          <Button className="text-lg">
            <CirclePlus />
            Nuevo Producto
          </Button>
        </Link>
      </section>
      <section className="listBody">
        {Loading ? (
          Array.from({ length: 12 }, (_, i) => {
            return (
              <Skeleton
                key={i}
                className="skeletonCard h-[350px] w-[24.25%] max-w-[400px]"
              />
            );
          })
        ) : !Loading && Products.length === 0 ? (
          <Alert variant="destructive" className="w-auto">
            <AlertCircle className="w-5 pt-1" />
            <AlertTitle className="text-xl">Error</AlertTitle>
            <AlertDescription className="text-lg">
              No se encontraron productos.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {Products?.map((product: CardProduct, i) => {
              return <ProductCard key={i} product={product} />;
            })}
            <Pagination className="mt-5">
              <PaginationContent>
                <PaginationItem
                  className="cursor-pointer"
                  onClick={() => handlePrev()}
                >
                  <PaginationPrevious />
                </PaginationItem>
                {CurrentPage - 1 >= 0 ? (
                  <PaginationItem
                    className="cursor-pointer"
                    onClick={() => handleClick(CurrentPage - 1)}
                  >
                    <PaginationLink>{CurrentPage}</PaginationLink>
                  </PaginationItem>
                ) : null}
                <PaginationItem>
                  <DropdownMenu
                    open={PaginationDropdownOpen}
                    onOpenChange={setPaginationDropdownOpen}
                  >
                    <DropdownMenuTrigger>
                      <PaginationLink>{CurrentPage + 1}</PaginationLink>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="inset-x-1/4">
                      <DropdownMenuLabel>Páginas</DropdownMenuLabel>
                      {Array.from(
                        { length: PaginationInfo?.totalPages ?? 0 },
                        (_, i) => {
                          return (
                            <DropdownMenuItem
                              key={i}
                              onClick={() => handleClick(i)}
                              className="cursor-pointer flex items-center justify-center"
                            >
                              {i + 1}
                            </DropdownMenuItem>
                          );
                        }
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </PaginationItem>
                {PaginationInfo?.totalPages &&
                CurrentPage + 1 < PaginationInfo?.totalPages ? (
                  <PaginationItem
                    className="cursor-pointer"
                    onClick={() => handleClick(CurrentPage + 1)}
                  >
                    <PaginationLink>{CurrentPage + 2}</PaginationLink>
                  </PaginationItem>
                ) : null}
                <PaginationItem
                  className="cursor-pointer"
                  onClick={() => handleNext()}
                >
                  <PaginationNext />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </section>
    </section>
  );
};
