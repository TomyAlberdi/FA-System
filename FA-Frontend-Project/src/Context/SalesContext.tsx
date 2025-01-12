import { ReturnData } from "@/hooks/CatalogInterfaces";
import { CompleteClient } from "@/hooks/SalesInterfaces";
import { createContext } from "react";

export interface SalesContextType {
  BASE_URL: string;
  // Clients
  Clients: ReturnData;
  fetchClients: () => Promise<void>;
  fetchClient: (id: number) => Promise<CompleteClient | undefined>;
}

export const SalesContext = createContext<SalesContextType | null>(null);