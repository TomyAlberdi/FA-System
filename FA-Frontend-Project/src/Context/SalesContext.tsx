import { createContext } from "react";

export interface SalesContextType {
  // Cash Register
  fetchRegisterTotalAmount: () => Promise<void>;
  RegisterTotalAmount: number;
  fetchRegisterTypes: (yearMonth: string) => Promise<void>;
  RegisterTypes: Array<number>;
  FormattedDate: string;
  setFormattedDate: React.Dispatch<React.SetStateAction<string>>;
}

export const SalesContext = createContext<SalesContextType | null>(null);
