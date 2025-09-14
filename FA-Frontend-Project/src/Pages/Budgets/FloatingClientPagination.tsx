import { Button } from "@/components/ui/button";
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
import { useBudgetContext } from "@/Context/Budget/UseBudgetContext";
import { PartialClient } from "@/hooks/SalesInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

export const FloatingClientPagination = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { getToken } = useKindeAuth();
  const [Clients, setClients] = useState<Array<PartialClient>>([]);
  const [LastLoadedPage, setLastLoadedPage] = useState(0);
  const [IsLastPage, setIsLastPage] = useState(false);
  const [Keyword, setKeyword] = useState("");
  const [Loading, setLoading] = useState(true);
  const { CurrentBudget, updateCurrentBudget } = useBudgetContext();

  const fetchClients = async (keyword: string) => {
    setLoading(true);
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const url = `${BASE_URL}/client/search?page=${LastLoadedPage}&size=15&keyword=${keyword}`;
      const accessToken = await getToken();
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching clients: ", response.status);
        window.alert(`Error buscando clientes: ${response.status}`);
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

  useEffect(() => {
    fetchClients(Keyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [LastLoadedPage]);

  return (
    <ScrollArea className="w-full h-full flex flex-col justify-center items-left">
      {Loading ? (
        Array.from({ length: 15 }, (_, i) => {
          return <Skeleton key={i} className="w-[98%] mb-3 h-[50px]" />;
        })
      ) : (
        <>
          <div className="w-full pb-2 flex flex-row items-center">
            <Input
              placeholder="Buscar por nombre, DNI o CUIT"
              type="text"
              className="md:w-1/2 w-full text-lg"
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button onClick={() => fetchClients(Keyword)} className="ml-2">
              <Search className="bigger-icon" />
            </Button>
          </div>
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
                    onClick={() =>
                      updateCurrentBudget({
                        ...CurrentBudget,
                        clientId: client.id,
                        client: {
                          name: client.name,
                          type: client.type,
                          address: "",
                          phone: "",
                          email: "",
                          cuit_dni: "",
                        },
                      })
                    }
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
