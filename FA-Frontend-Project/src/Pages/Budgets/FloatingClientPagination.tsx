import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSalesContext } from "@/Context/UseSalesContext";
import { PartialClient } from "@/hooks/SalesInterfaces";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface FloatingClientPaginationProps {
  handleSelectClient: (client: PartialClient) => void;
}

const formSchema = z.object({
  keyword: z.string(),
});

export const FloatingClientPagination = ({
  handleSelectClient,
}: FloatingClientPaginationProps) => {
  const { BASE_URL } = useSalesContext();
  const { getToken } = useKindeAuth();
  const { toast } = useToast();

  const [Clients, setClients] = useState<Array<PartialClient>>([]);
  const [LastLoadedPage, setLastLoadedPage] = useState(0);
  const [IsLastPage, setIsLastPage] = useState(false);
  const [Keyword, setKeyword] = useState("");
  const [Loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        if (!getToken) {
          console.error("getToken is undefined");
          return;
        }
        let url = `${BASE_URL}/client/search?page=${LastLoadedPage}&size=15`;
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
          console.error("Error fetching clients: ", response.status);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Ocurrió un error al buscar clientes.",
          });
          return;
        }
        const result = await response.json();
        const newClients = result.content;
        setClients((prevClients) => {
          if (LastLoadedPage === 0) {
            return newClients;
          }
          const existingIds = prevClients.map((client) => client.id);
          const filteredNewClients = newClients.filter(
            (client: PartialClient) => !existingIds.includes(client.id)
          );
          return [...prevClients, ...filteredNewClients];
        });
        setIsLastPage(result.last);
      } catch (error) {
        console.error("Error fetching clients: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [LastLoadedPage, Keyword]);

  return (
    <ScrollArea className="w-full h-full flex flex-col justify-center items-left">
      {Loading ? (
        Array.from({ length: 15 }, (_, i) => {
          return <Skeleton key={i} className="w-[98%] mb-3 h-[50px]" />;
        })
      ) : (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => setKeyword(data.keyword))}
              className="w-full pb-2 flex flex-row items-center"
            >
              <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <Input
                    placeholder="Buscar por nombre, DNI o CUIT"
                    type="text"
                    className="w-1/2 text-lg"
                    {...field}
                  />
                )}
              />
              <Button type="submit" className="ml-2">
                <Search className="bigger-icon" />
              </Button>
            </form>
          </Form>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-2/3">Nombre</TableHead>
                <TableHead className="w-1/3">Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Clients?.map((client: PartialClient, i) => {
                return (
                  <TableRow
                    key={i}
                    className="cursor-pointer"
                    onClick={() => handleSelectClient(client)}
                  >
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell className="font-medium">{client.type}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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
        </>
      )}
    </ScrollArea>
  );
};
