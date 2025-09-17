import {
  ProviderContext,
  ProviderContextType,
} from "@/Context/Provider/ProviderContext";
import {
  CreateProviderDTO,
  Provider
} from "@/hooks/CatalogInterfaces";
// removed getToken-based auth
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface ProviderContextComponentProps {
  children: ReactNode;
}

const ProviderContextComponent: React.FC<ProviderContextComponentProps> = ({
  children,
}) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const fetchProviders = async () => {
    try {
      const response = await fetch(`${BASE_URL}/provider`);
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        window.alert(
          "Ocurrió un error al obtener los proveedores: " + response.status
        );
        return [];
      }
      const result: Array<Provider> = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching providers: ", error);
      return [];
    }
  };

  const fetchProvider = async (identifier: number | string) => {
    try {
      const response = await fetch(`${BASE_URL}/provider/${identifier}`);
      if (!response.ok) {
        console.error("Error fetching Provider: ", response.statusText);
        window.alert(
          "Ocurrió un error al obtener el proveedor: " + response.status
        );
        return;
      }
      const result: Provider = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Provider: ", error);
    }
  };

  const fetchProviderProducts = async (
    id: number,
    page: number,
    size: number
  ) => {
    try {
      const response = await fetch(
        `${BASE_URL}/provider/${id}/products?page=${page}&size=${size}`
      );
      if (!response.ok) {
        console.error(
          "Error fetching Provider products: ",
          response.statusText
        );
        window.alert(
          "Ocurrió un error al obtener los productos del proveedor: " +
            response.status
        );
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Provider products: ", error);
    }
  };

  const createProvider = async (dto: CreateProviderDTO) => {
    try {
      const response = await fetch(`${BASE_URL}/provider`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) {
        console.error("Error fetching Provider: ", response.statusText);
        window.alert(
          "Ocurrió un error al crear el proveedor: " + response.status
        );
        return;
      }
      const result: Provider = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Provider: ", error);
    }
  };

  const updateProvider = async (id: number, dto: CreateProviderDTO) => {
    try {
      const response = await fetch(`${BASE_URL}/provider/${id}?`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) {
        console.error("Error fetching Provider: ", response.statusText);
        window.alert(
          "Ocurrió un error al actualizar el proveedor: " + response.status
        );
        return;
      }
      const result: Provider = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Provider: ", error);
    }
  };

  const deleteProvider = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/provider/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        console.error("Error fetching Provider: ", response.statusText);
        window.alert(
          "Ocurrió un error al eliminar el proveedor: " + response.status
        );
        return;
      }
      navigate(-1);
    } catch (error) {
      console.error("Error fetching Provider: ", error);
    }
  };

  const exportData: ProviderContextType = {
    fetchProviders,
    fetchProvider,
    fetchProviderProducts,
    createProvider,
    updateProvider,
    deleteProvider,
  };

  return (
    <ProviderContext.Provider value={exportData}>
      {children}
    </ProviderContext.Provider>
  );
};

export default ProviderContextComponent;
