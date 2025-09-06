import { createContext } from "react";

export interface CashRegisterContextType {
  fetchCashRegisterTotalAmount: () => Promise<void>;
  CashRegisterTotalAmount: number;
  fetchCashRegisterTypes: (yearMonth: string) => Promise<void>;
  RegisterTypes: Array<number>;
  FormattedDate: string;
  setFormattedDate: React.Dispatch<React.SetStateAction<string>>;
}

export const CashRegisterContext = createContext<CashRegisterContextType | null>(null);