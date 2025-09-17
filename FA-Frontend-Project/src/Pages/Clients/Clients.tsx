import { PaginationInfo } from "@/hooks/CatalogInterfaces";
import { ClientsFilter, PartialClient } from "@/hooks/SalesInterfaces";
import { ClientsHeader } from "@/Pages/Clients/ClientsHeader";
import { ClientsPagination } from "@/Pages/Clients/ClientsPagination";
import MobileClientsHeader from "@/Pages/Clients/Mobile/MobileClientsHeader";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useEffect, useState } from "react";

export const Clients = () => {
  const { getToken } = useKindeAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [CurrentPage, setCurrentPage] = useState(0);
  const [PaginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    pageNumber: 0,
    totalPages: 0,
    totalElements: 0,
    first: false,
    last: false,
  });

  const [Loading, setLoading] = useState(true);
  const [Clients, setClients] = useState<Array<PartialClient>>([]);

  const [Filters, setFilters] = useState<ClientsFilter>({
    keyword: "",
    type: "",
  });

  useEffect(() => {
    const handleSearch = async () => {
      let url = `${BASE_URL}/client/search?page=${CurrentPage}&size=25`;
      if (Filters.keyword.length > 0) {
        url += `&keyword=${Filters.keyword}`;
      }
      if (Filters.type.length > 0) {
        url += `&type=${Filters.type}`;
      }
      try {
        if (!getToken) {
          console.error("getToken is undefined");
          return;
        }
        const accessToken = await getToken();
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          console.error("Error fetching clients: ", response.status);
          window.alert("Ocurrió un error al obtener los clientes: " + response.status);
          return;
        }
        const result = await response.json();
        setClients(result.content);
        setPaginationInfo({
          pageNumber: result.pageable.pageNunber,
          totalPages: result.totalPages,
          totalElements: result.totalElements,
          first: result.first,
          last: result.last,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching clients: ", error);
      } finally {
        setLoading(false);
      }
    };
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Filters, CurrentPage, BASE_URL]);

  return (
    <div className="Clients">
      <ClientsHeader setFilters={setFilters} />
      <MobileClientsHeader setFilters={setFilters} />
      <ClientsPagination
        Clients={Clients}
        CurrentPage={CurrentPage}
        setCurrentPage={setCurrentPage}
        PaginationInfo={PaginationInfo}
        Loading={Loading}
      />
    </div>
  );
};
