import { PaginationInfo } from "@/hooks/CatalogInterfaces";
import { PartialClient } from "@/hooks/SalesInterfaces"

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
        return <div key={i}>{client.name}</div>
      })}
    </div>
  )
}