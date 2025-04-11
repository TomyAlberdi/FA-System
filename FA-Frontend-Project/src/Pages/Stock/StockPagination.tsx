import { TooltipProvider } from "@/components/ui/tooltip";
import { PaginationInfo, PartialProductStock } from "@/hooks/CatalogInterfaces";
import { useState } from "react";
import { StockCard } from "@/Pages/Stock/StockCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StockPaginationProps {
  Stocks: Array<PartialProductStock>;
  CurrentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  PaginationInfo: PaginationInfo;
}

//TODO: Mobile Stock Pagination
export const StockPagination: React.FC<StockPaginationProps> = ({
  Stocks,
  CurrentPage,
  setCurrentPage,
  PaginationInfo,
}) => {
  const [PaginationDropdownOpen, setPaginationDropdownOpen] = useState(false);

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
    <section className="StockPagination w-full">
      <section className="listBody md:gap-[1%] w-full">
        <TooltipProvider>
          {Stocks?.map((stock: PartialProductStock, i) => {
            return <StockCard key={i} stock={stock} />;
          })}
        </TooltipProvider>
      </section>
      {!PaginationInfo?.last && (
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
      )}
    </section>
  );
};
