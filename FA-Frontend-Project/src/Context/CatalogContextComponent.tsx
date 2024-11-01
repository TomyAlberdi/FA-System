import { CatalogContext, CatalogContextType } from "@/Context/CatalogContext";
import { ReactNode } from "react";

interface CatalogContextComponentProps {
  children: ReactNode;
}

interface Category {
  id: number;
  name: string;
  productsAmount: number;
}

interface Provider {
  id: number;
  name: string;
  productsAmount: number;
}

const CatalogContextComponent: React.FC<CatalogContextComponentProps> = ({ children }) => {

  const BASE_URL = "http://localhost:8080"

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/category`);
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        return;
      }
      const result: Array<Category> = await response.json();
      return(result);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

  const fetchProviders = async () => {
    try {
      const response = await fetch(`${BASE_URL}/provider`);
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        return;
      }
      const result: Array<Provider> = await response.json();
      return (result);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

  const exportData: CatalogContextType = {
    BASE_URL,
    fetchCategories,
    fetchProviders,
  }

  return (
    <CatalogContext.Provider value={exportData}>{children}</CatalogContext.Provider>
  )

}

export default CatalogContextComponent;