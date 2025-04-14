import { useSalesContext } from "@/Context/UseSalesContext";
import { PaginationInfo } from "@/hooks/CatalogInterfaces";
import { ClientsFilter, PartialClient } from "@/hooks/SalesInterfaces";
import { ClientsHeader } from "@/Pages/Clients/ClientsHeader";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useEffect, useState } from "react";
import { ClientsPagination } from "@/Pages/Clients/ClientsPagination";
import MobileClientsHeader from '@/Pages/Clients/Mobile/MobileClientsHeader'

export const Clients = () => {
  const { BASE_URL } = useSalesContext();
  const { getToken } = useKindeAuth();

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

  const handleRefresh = () => {
    setCurrentPage(0);
    setFilters({
      keyword: "",
      type: "",
    });
  };

  useEffect(() => {
    const handleSearch = async () => {
      let url = `${BASE_URL}/client/search?page=${CurrentPage}&size=15`;
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
      <ClientsHeader
        setFilters={setFilters}
        handleRefresh={handleRefresh}
      />
      <MobileClientsHeader setFilters={setFilters} handleRefresh={handleRefresh} />
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
