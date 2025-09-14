import { ReturnData } from "@/hooks/CatalogInterfaces";
import { CompleteClient, CreateClientDTO, PartialClient } from "@/hooks/SalesInterfaces";
import { createContext } from "react";

export interface ClientContextType {
  Clients: ReturnData<PartialClient>;
  fetchClients: () => Promise<void>;
  fetchClient: (id: number) => Promise<CompleteClient | undefined>;
  createClient: (dto: CreateClientDTO) => Promise<void>;
  updateClient: (id: number, dto: CreateClientDTO) => Promise<void>;
  deleteClient: (id: number) => Promise<void>;
  ClientUpdater: number;
}

export const ClientContext = createContext<ClientContextType | null>(null);