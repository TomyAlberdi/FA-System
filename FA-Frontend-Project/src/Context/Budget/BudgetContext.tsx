import { CompleteBudget, CreateBudgetDTO, PartialBudget } from "@/hooks/SalesInterfaces";
import { createContext } from "react";

export interface BudgetContextType {
  fetchBudgetsByClient: (
    id: number
  ) => Promise<Array<PartialBudget> | undefined>;
  fetchBudget: (id: number) => Promise<CompleteBudget | undefined>;
  fetchBudgetsByDate: (
    date: string
  ) => Promise<Array<PartialBudget> | undefined>;
  fetchBudgetsByDateRange: (
    start: string,
    end: string
  ) => Promise<Array<PartialBudget> | undefined>;
  createBudget: (dto: CreateBudgetDTO, clientId?: number) => Promise<void>;
  updateBudget: (
    dto: CreateBudgetDTO,
    budgetId: number,
    clientId?: number
  ) => Promise<void>;
  updateBudgetStatus: (status: string, budgetId: number) => Promise<void>;
  BudgetUpdater: number;
  deleteBudget: (budgetId: number) => Promise<void>;
  // CART
  CurrentBudget: CreateBudgetDTO;
  updateCurrentBudget: (budget: CreateBudgetDTO) => CreateBudgetDTO;
  clearCurrentBudget: () => void;
}

export const BudgetContext = createContext<BudgetContextType | null>(null);
