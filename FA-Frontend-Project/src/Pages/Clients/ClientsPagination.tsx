import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PaginationInfo } from "@/hooks/CatalogInterfaces";
import { PartialClient } from "@/hooks/SalesInterfaces";
import { ClientCard } from "@/Pages/Clients/ClientCard";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
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

interface ClientsPaginationProps {
  Clients: Array<PartialClient>;
  CurrentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  PaginationInfo: PaginationInfo;
  Loading: boolean;
}

export const ClientsPagination: React.FC<ClientsPaginationProps> = ({
  Clients,
  CurrentPage,
  setCurrentPage,
  PaginationInfo,
  Loading,
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
      CurrentPage + 1 < PaginationInfo.totalPages
    ) {
      setCurrentPage(CurrentPage + 1);
    }
  };

  const handleClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className="listBody">
      {Loading ? (
        Array.from({ length: 15 }, (_, i) => {
          return (
            <Skeleton
              key={i}
              className="skeletonCard h-[350px] w-[24.25%] max-w-[400px]"
            />
          );
        })
      ) : !Loading && Clients.length === 0 ? (
        <Alert variant={"destructive"} className="w-auto">
          <AlertCircle className="w-5 pt-1" />
          <AlertTitle className="text-xl">Error</AlertTitle>
          <AlertDescription className="text-lg">
            No se encontraron clientes.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <TooltipProvider>
            {Clients?.map((client: PartialClient, i) => {
              return <ClientCard key={i} client={client} />;
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
  );
};
