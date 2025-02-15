import { CompleteBudget, CompleteClient, PartialBudget, PartialClient } from "@/hooks/SalesInterfaces";
import { createContext } from "react";

export interface SalesContextType {
  BASE_URL: string;
  // Clients
  fetchClient: (id: number) => Promise<CompleteClient | undefined>;
  fetchListOfClients: () => Promise<Array<PartialClient> | undefined>;
  // Budgets
  fetchBudgetsByClient: (id: number) => Promise<Array<PartialBudget> | undefined>;
  fetchCompleteBudget: (id: number) => Promise<CompleteBudget | undefined>;
  fetchBudgetsByDate: (date: string) => Promise<Array<PartialBudget> | undefined>;
  fetchBudgetsByDateRange: (start: string, end: string) => Promise<Array<PartialBudget> | undefined>;
}

export const SalesContext = createContext<SalesContextType | null>(null);