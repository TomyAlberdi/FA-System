import {
  CompleteClient,
  CreateClientDTO,
  PartialClient,
} from "@/hooks/SalesInterfaces";
import { createContext } from "react";

export interface ClientContextType {
  fetchClients: () => Promise<PartialClient[]>;
  fetchClient: (id: number) => Promise<CompleteClient | undefined>;
  createClient: (dto: CreateClientDTO) => Promise<void>;
  updateClient: (id: number, dto: CreateClientDTO) => Promise<void>;
  deleteClient: (id: number) => Promise<void>;
}

export const ClientContext = createContext<ClientContextType | null>(null);
