import { CatalogContext } from "@/Context/CatalogContext";
import { ReactNode } from "react";

interface CatalogContextComponentProps {
  children: ReactNode;
}

const CatalogContextComponent: React.FC<CatalogContextComponentProps> = ({ children }) => {

  const BASE_URL = "https://localhost:8443"

  const exportData = {
    BASE_URL,
  }

  return (
    <CatalogContext.Provider value={exportData}>{children}</CatalogContext.Provider>
  )

}

export default CatalogContextComponent;