import { ProviderContext } from "@/Context/Provider/ProviderContext";
import { useContext } from "react";

export const useProviderContext = () => {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error(
      "useProviderContext must be used within a ProviderContextComponent"
    );
  }
  return context;
};
