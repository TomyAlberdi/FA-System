import { CatalogContext, CatalogContextType } from "@/Context/CatalogContext";
import { ReactNode } from "react";

interface CatalogContextComponentProps {
  children: ReactNode;
}

const CatalogContextComponent: React.FC<CatalogContextComponentProps> = ({ children }) => {

  const BASE_URL = "http://localhost:8080"

  const exportData: CatalogContextType = {
    BASE_URL,
  }

  return (
    <CatalogContext.Provider value={exportData}>{children}</CatalogContext.Provider>
  )

}

export default CatalogContextComponent;