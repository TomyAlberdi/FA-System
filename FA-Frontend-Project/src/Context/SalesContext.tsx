import {
  CompleteBudget,
  CompleteClient,
  PartialBudget,
  PartialClient,
  RegisterRecord,
} from "@/hooks/SalesInterfaces";
import { createContext } from "react";

export interface SalesContextType {
  BASE_URL: string;
  // Clients
  fetchClient: (id: number) => Promise<CompleteClient | undefined>;
  fetchListOfClients: () => Promise<Array<PartialClient> | undefined>;
  // Budgets
  fetchBudgetsByClient: (
    id: number
  ) => Promise<Array<PartialBudget> | undefined>;
  fetchCompleteBudget: (id: number) => Promise<CompleteBudget | undefined>;
  fetchBudgetsByDate: (
    date: string
  ) => Promise<Array<PartialBudget> | undefined>;
  fetchBudgetsByDateRange: (
    start: string,
    end: string
  ) => Promise<Array<PartialBudget> | undefined>;
  // Cash Register
  fetchRegisterTotalAmount: () => Promise<void>;
  RegisterTotalAmount: number;
  fetchRegisterTypes: (yearMonth: string) => Promise<void>;
  RegisterTypes: Array<number>;
  fetchRegisterByDate: (
    date: string
  ) => Promise<Array<RegisterRecord> | undefined>;
}

export const SalesContext = createContext<SalesContextType | null>(null);
