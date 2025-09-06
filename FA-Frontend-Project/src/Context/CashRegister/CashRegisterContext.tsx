import {
  createCashRegisterRecordDTO,
  RegisterRecord,
} from "@/hooks/SalesInterfaces";
import { createContext } from "react";

export interface CashRegisterContextType {
  fetchCashRegisterTotalAmount: () => Promise<void>;
  CashRegisterTotalAmount: number;
  fetchCashRegisterTypes: (yearMonth: string) => Promise<void>;
  RegisterTypes: Array<number>;
  FormattedDate: string;
  setFormattedDate: React.Dispatch<React.SetStateAction<string>>;
  createRecord: (record: createCashRegisterRecordDTO) => Promise<void>;
  getRecordsByDate: (date: string) => Promise<Array<RegisterRecord> | undefined>;
  deleteRecord: (id: number) => Promise<void>;
}

export const CashRegisterContext =
  createContext<CashRegisterContextType | null>(null);
