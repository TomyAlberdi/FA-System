import { CatalogContext, CatalogContextType } from "@/Context/CatalogContext";
import { ReactNode } from "react";
import { Category, Measure, Provider, StockProduct, Subcategory } from "@/hooks/CatalogInterfaces";
import { useToast } from "@/hooks/use-toast";

interface CatalogContextComponentProps {
  children: ReactNode;
}

const CatalogContextComponent: React.FC<CatalogContextComponentProps> = ({ children }) => {

  const { toast } = useToast();

  const BASE_URL = "http://localhost:8081"

  /// CATEGORY GET /////

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

  const fetchCategory = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/category/${id}`);
      if (!response.ok) {
        console.error("Error fetching Category: ", response.statusText);
        return;
      }
      const result: Category = await response.json();
      return (result);
    } catch (error) {
      console.error("Error fetching Category: ", error);
    }
  }

  const fetchCategoryProducts = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/category/${id}/products`);
      if (!response.ok) {
        console.error("Error fetching Category: ", response.statusText);
        toast({
          variant: "destructive",
          title: `Error ${response.status}`,
          description: `Ocurrió un error al obtener los productos de la categoría.`,
        });
        return;
      }
      const result: Array<StockProduct> = await response.json();
      return (result);
    } catch (error) {
      console.error("Error fetching Provider: ", error);
    }
  }

  /// SUBCATEGORY GET /////

  const fetchSubcategoriesByCategoryId = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/category/${id}/subcategories`);
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        return;
      }
      const result: Array<Subcategory> = await response.json();
      return (result);
    } catch (error) {
      console.error("Error fetching Provider: ", error);
    }
  }

  /// PROVIDER GET /////

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

  const fetchProvider = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/provider/${id}`);
      if (!response.ok) {
        console.error("Error fetching Provider: ", response.statusText);
        toast({
          variant: "destructive",
          title: `Error ${response.status}`,
          description: `Ocurrió un error al obtener el proveedor.`,
        });
        return;
      }
      const result: Provider = await response.json();
      return (result);
    } catch (error) {
      console.error("Error fetching Provider: ", error);
    }
  }

  const fetchProviderProducts = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/provider/${id}/products`);
      if (!response.ok) {
        console.error(
          "Error fetching Provider products: ",
          response.statusText
        );
        toast({
          variant: "destructive",
          title: `Error ${response.status}`,
          description: `Ocurrió un error al obtener los productos del proveedor.`,
        });
        return;
      }
      const result: Array<StockProduct> = await response.json();
      return (result);
    } catch (error) {
      console.error("Error fetching Provider products: ", error);
    }
  }

  /// MEASURE GET /////

  const fetchMeasures = async () => {
    try {
      const response = await fetch(`${BASE_URL}/filter/measures`);
      if (!response.ok) {
        console.error("Error fetching Measures: ", response.statusText);
        toast({
          variant: "destructive",
          title: `Error ${response.status}`,
          description: `Ocurrió un error al obtener los productos de la categoría.`,
        });
        return;
      }
      const result: Array<Measure> = await response.json();
      return (result);
    } catch (error) {
      console.error("Error fetching Measures: ", error);
    }
  }

  /// PRICES GET /////

  

  /// FILTER LOGIC /////

  const exportData: CatalogContextType = {
    BASE_URL,
    fetchCategories,
    fetchCategory,
    fetchCategoryProducts,
    fetchSubcategoriesByCategoryId,
    fetchProviders,
    fetchProvider,
    fetchProviderProducts,
    fetchMeasures,
  }

  return (
    <CatalogContext.Provider value={exportData}>{children}</CatalogContext.Provider>
  )

}

export default CatalogContextComponent;