import { createContext } from "react";

export interface SalesContextType {
  BASE_URL: string;
}

export const SalesContext = createContext<SalesContextType | null>(null);