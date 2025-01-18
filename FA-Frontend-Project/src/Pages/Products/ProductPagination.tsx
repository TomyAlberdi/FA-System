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
import {
  CardProduct,
  FilterData,
  PaginationInfo,
} from "@/hooks/CatalogInterfaces";
import { AlertCircle, CirclePlus, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/Pages/Products/ProductCard";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RefreshCcw } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ProductPaginationProps {
  Products: Array<CardProduct>;
  CurrentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  PaginationInfo: PaginationInfo;
  Loading: boolean;
  Filter: Array<FilterData | null>;
  setFilter: React.Dispatch<React.SetStateAction<Array<FilterData | null>>>;
}

const formSchema = z.object({
  keyword: z.string(),
});

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: "",
    },
  });

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
    <section className="ProductPagination col-span-6">
      <section className="listHeader flex flex-row items-center justify-between">
        <Button onClick={handleRefresh} className="text-lg w-[19.2%] max-w-[300px] min-w-[200px]">
          <RefreshCcw />
          Recargar productos
        </Button>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => handleKeyword(data.keyword))}
            className="flex flex-row items-start justify-start gap-2 w-1/2"
          >
            <FormField
              control={form.control}
              name="keyword"
              render={({ field }) => (
                <Input
                  placeholder="Buscar por nombre, código o descripción"
                  type="text"
                  className="w-full text-lg"
                  {...field}
                />
              )}
            />
            <Button type="submit" className="w-10">
              <Search className="bigger-icon" />
            </Button>
          </form>
        </Form>
        <Link to={"/catalog/products/add"}>
          <Button className="text-lg w-[19.2%] max-w-[300px] min-w-[200px]">
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
