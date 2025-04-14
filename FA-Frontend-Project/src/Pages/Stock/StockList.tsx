import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { PaginationInfo, PartialProductStock } from "@/hooks/CatalogInterfaces";
import { AlertCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { StockPagination } from "@/Pages/Stock/StockPagination";
import { Label } from "@/components/ui/label";

export const StockList = () => {
  const { fetchStockListByKeyword } = useCatalogContext();

  const [Keyword, setKeyword] = useState("");
  const [CurrentPage, setCurrentPage] = useState(0);
  const [PaginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    pageNumber: 0,
    totalPages: 0,
    totalElements: 0,
    first: false,
    last: false,
  });
  const [Stocks, setStocks] = useState<Array<PartialProductStock>>([]);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchStockListByKeyword(Keyword, CurrentPage, 15)
      .then((result) => {
        setStocks(result.content);
        setPaginationInfo({
          pageNumber: result.pageable.pageNumber,
          totalPages: result.totalPages,
          totalElements: result.totalElements,
          first: result.first,
          last: result.last,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((error) => {
        console.error("Error fetching stocks: ", error);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CurrentPage]);

  const handleSearch = (keyword: string) => {
    setLoading(true);
    fetchStockListByKeyword(keyword, 0, 15)
      .then((result) => {
        setStocks(result.content);
        setPaginationInfo({
          pageNumber: result.pageable.pageNumber,
          totalPages: result.totalPages,
          totalElements: result.totalElements,
          first: result.first,
          last: result.last,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((error) => {
        console.error("Error fetching stocks: ", error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="StockList flex flex-col items-start justify-start h-full w-full">
      <div className="flex flex-row items-start justify-start w-full">
        <Label />
        <Input
          placeholder="Buscar por nombre o ID"
          type="text"
          className="md:w-96 w-full"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button
          type="submit"
          className="w-10 ml-2"
          onClick={() => handleSearch(Keyword)}
        >
          <Search className="bigger-icon" />
        </Button>
      </div>
      {Loading ? (
        <div className="flex flex-col gap-4 mt-4 w-full h-full">
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-full" />
        </div>
      ) : Stocks?.length === 0 ? (
        <Alert variant="destructive" className="md:w-auto w-full mt-4">
          <AlertCircle className="w-5 pt-1" />
          <AlertTitle className="text-xl">Error</AlertTitle>
          <AlertDescription className="text-lg">
            No se encontraron productos.
          </AlertDescription>
        </Alert>
      ) : (
        <StockPagination
          Stocks={Stocks}
          CurrentPage={CurrentPage}
          setCurrentPage={setCurrentPage}
          PaginationInfo={PaginationInfo}
        />
      )}
    </div>
  );
};
