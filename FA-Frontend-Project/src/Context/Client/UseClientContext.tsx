import { ClientContext } from "@/Context/Client/ClientContext";
import { useContext } from "react";

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error(
      "useClientContext must be used within a ClientContextComponent"
    );
  }
  return context;
};
