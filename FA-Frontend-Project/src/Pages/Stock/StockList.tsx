import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { PaginationInfo, PartialProductStock } from "@/hooks/CatalogInterfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { StockPagination } from "@/Pages/Stock/StockPagination";

const formSchema = z.object({
  keyword: z.string()
});

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: "",
    },
  });

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
  }, [Keyword, CurrentPage]);

  return (
    <div className="StockList flex flex-col items-start justify-start h-full w-full gap-4">
      {Loading ? (
        <>
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-full" />
        </>
      ) : Stocks?.length === 0 ? (
        <Alert variant="destructive" className="w-auto">
          <AlertCircle className="w-5 pt-1" />
          <AlertTitle className="text-xl">Error</AlertTitle>
          <AlertDescription className="text-lg">
            Error al obtener el stock de los productos.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => setKeyword(data.keyword))}
              className="flex flex-row items-start justify-start gap-2"
            >
              <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Buscar por nombre o ID"
                        type="text"
                        className="w-96"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-10">
                <Search className="bigger-icon" />
              </Button>
            </form>
          </Form>
          <StockPagination Stocks={Stocks} CurrentPage={CurrentPage} setCurrentPage={setCurrentPage} PaginationInfo={PaginationInfo} />
        </>
      )}
    </div>
  );
};
