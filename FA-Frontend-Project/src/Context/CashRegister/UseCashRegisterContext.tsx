import { CashRegisterContext } from "@/Context/CashRegister/CashRegisterContext";
import { useContext } from "react";

export const useCashRegisterContext = () => {
  const context = useContext(CashRegisterContext);
  if (!context) {
    throw new Error(
      "useCashRegisterContext must be used within a CashRegisterContextComponent"
    );
  }
  return context;
};