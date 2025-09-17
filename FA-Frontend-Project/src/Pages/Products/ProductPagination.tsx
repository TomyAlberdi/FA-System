import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  CardProduct,
  FilterData,
  PaginationInfo,
} from "@/hooks/CatalogInterfaces";
import MobileFilters from "@/Pages/Products/Mobile/MobileFilters";
import { ProductCard } from "@/Pages/Products/ProductCard";
import { AlertCircle, CirclePlus, RefreshCcw, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface ProductPaginationProps {
  Products: Array<CardProduct>;
  CurrentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  PaginationInfo: PaginationInfo;
  Loading: boolean;
  Filter: Array<FilterData | null>;
  setFilter: React.Dispatch<React.SetStateAction<Array<FilterData | null>>>;
}

export const ProductPagination: React.FC<ProductPaginationProps> = ({
  Products,
  CurrentPage,
  setCurrentPage,
  PaginationInfo,
  Loading,
  Filter,
  setFilter,
}) => {
  const [PaginationDropdownOpen, setPaginationDropdownOpen] = useState(false);

  const [Keyword, setKeyword] = useState<string>("");

  const handleKeyword = (keyword: string) => {
    // Remove all filters with type "keyword"
    const newAppliedFilters = Filter?.filter(
      (filter) => filter?.type !== "keyword"
    );
    if (keyword.length > 0) {
      // Update the appliedFilters array with the new filter
      newAppliedFilters?.push({
        type: "keyword",
        value: keyword,
      });
    }
    // Update the filter array with the new filter
    setFilter(newAppliedFilters);
  };

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

  const handleRefresh = () => {
    setCurrentPage(0);
    setFilter([]);
  };

  return (
    <section className="ProductPagination md:col-span-6 col-span-12">
      <section className="listHeader hidden md:flex flex-row items-center justify-between">
        <Button
          onClick={handleRefresh}
          className="text-lg w-[19.2%] max-w-[300px] min-w-[200px]"
        >
          <RefreshCcw />
          Recargar productos
        </Button>
        <div className="flex flex-row items-start justify-start gap-2 w-1/2">
          <Input
            placeholder="Buscar por nombre, código o descripción"
            type="text"
            className="w-full text-lg"
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button
            type="submit"
            className="w-10"
            onClick={() => handleKeyword(Keyword)}
          >
            <Search className="bigger-icon" />
          </Button>
        </div>
        <Button asChild className="text-lg w-[19.2%] max-w-[300px] min-w-[200px]">
          <Link to={`/catalog/products/create`}>
            <CirclePlus />
            Nuevo Producto
          </Link>
        </Button>
      </section>
      <section className="listHeader flex md:hidden">
        <Button onClick={handleRefresh} className="text-lg">
          <RefreshCcw className="bigger-icon" />
        </Button>
        <div className="flex gap-5">
          <Button asChild>
            <Link to={`/catalog/products/create`}>
              <CirclePlus />
              Nuevo Producto
            </Link>
          </Button>
          <MobileFilters
            Filter={Filter}
            setFilter={setFilter}
            Loading={Loading}
          />
        </div>
      </section>
      <section className="listBody md:gap-[1%] gap-2">
        {Loading ? (
          Array.from({ length: 12 }, (_, i) => {
            return (
              <Skeleton
                key={i}
                className="skeletonCard md:h-[350px] md:w-[24.25%] md:max-w-[400px] h-[200px] w-full"
              />
            );
          })
        ) : !Loading && Products.length === 0 ? (
          <Alert variant="destructive" className="md:w-auto w-full">
            <AlertCircle className="w-5 pt-1" />
            <AlertTitle className="text-xl">Error</AlertTitle>
            <AlertDescription className="text-lg">
              No se encontraron productos.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <TooltipProvider>
              {Products?.map((product: CardProduct, i) => {
                return <ProductCard key={i} product={product} />;
              })}
            </TooltipProvider>
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
