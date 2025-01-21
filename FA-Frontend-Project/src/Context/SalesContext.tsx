import { CompleteBudget, CompleteClient } from "@/hooks/SalesInterfaces";
import { createContext } from "react";

export interface SalesContextType {
  BASE_URL: string;
  // Clients
  fetchClient: (id: number) => Promise<CompleteClient | undefined>;
  // Budgets
  fetchBudgetsByClient: (id: number) => Promise<Array<CompleteBudget> | undefined>;
}

export const SalesContext = createContext<SalesContextType | null>(null);