import { CompleteBudget, CompleteClient, PartialClient } from "@/hooks/SalesInterfaces";
import { createContext } from "react";

export interface SalesContextType {
  BASE_URL: string;
  // Clients
  fetchClient: (id: number) => Promise<CompleteClient | undefined>;
  fetchListOfClients: () => Promise<Array<PartialClient> | undefined>;
  // Budgets
  fetchBudgetsByClient: (id: number) => Promise<Array<CompleteBudget> | undefined>;
}

export const SalesContext = createContext<SalesContextType | null>(null);