import { PaginationInfo } from "@/hooks/CatalogInterfaces";
import { PartialClient } from "@/hooks/SalesInterfaces";
import { ClientCard } from "@/Pages/Clients/ClientCard";

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
  return (
    <div>
      {Clients?.map((client: PartialClient, i) => {
        return <ClientCard client={client} key={i} />;
      })}
    </div>
  );
};
