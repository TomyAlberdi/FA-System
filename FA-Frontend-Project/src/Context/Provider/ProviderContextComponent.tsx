import {
  ProviderContext,
  ProviderContextType,
} from "@/Context/Provider/ProviderContext";
import {
  CreateProviderDTO,
  Provider,
  ReturnData,
} from "@/hooks/CatalogInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProviderContextComponentProps {
  children: ReactNode;
}

const ProviderContextComponent: React.FC<ProviderContextComponentProps> = ({
  children,
}) => {
  const { getToken } = useKindeAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [Providers, setProviders] = useState<ReturnData<Provider>>({
    Loading: true,
    data: Array<Provider>(),
  });

  const fetchProviders = async () => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/provider`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        window.alert("Ocurrió un error al obtener los proveedores: " + response.status);
        return;
      }
      const result: Array<Provider> = await response.json();
      setProviders({ Loading: false, data: result });
    } catch (error) {
      console.error("Error fetching providers: ", error);
      setProviders({ Loading: false, data: [] });
    }
  };

  const fetchProvider = async (identifier: number | string) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/provider/${identifier}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching Provider: ", response.statusText);
        window.alert("Ocurrió un error al obtener el proveedor: " + response.status);
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
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(
        `${BASE_URL}/provider/${id}/products?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        console.error(
          "Error fetching Provider products: ",
          response.statusText
        );
        window.alert("Ocurrió un error al obtener los productos del proveedor: " + response.status);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Provider products: ", error);
    }
  };

  const createProvider = async (dto: CreateProviderDTO) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/provider`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) {
        console.error("Error fetching Provider: ", response.statusText);
        window.alert("Ocurrió un error al crear el proveedor: " + response.status);
        return;
      }
      await fetchProviders();
      const result: Provider = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Provider: ", error);
    }
  };

  const [ProviderUpdater, setProviderUpdater] = useState(0);

  const updateProvider = async (id: number, dto: CreateProviderDTO) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/provider/${id}?`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) {
        console.error("Error fetching Provider: ", response.statusText);
        window.alert("Ocurrió un error al actualizar el proveedor: " + response.status);
        return;
      }
      setProviderUpdater((prev) => prev + 1);
      await fetchProviders();
      const result: Provider = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Provider: ", error);
    }
  };

  const deleteProvider = async (id: number) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/provider/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching Provider: ", response.statusText);
        window.alert("Ocurrió un error al eliminar el proveedor: " + response.status);
        return;
      }
      await fetchProviders();
      navigate(-1);
    } catch (error) {
      console.error("Error fetching Provider: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (getToken) {
        const accessToken = await getToken();
        if (accessToken) {
          fetchProviders();
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken]);

  const exportData: ProviderContextType = {
    Providers,
    fetchProviders,
    fetchProvider,
    fetchProviderProducts,
    createProvider,
    updateProvider,
    deleteProvider,
    ProviderUpdater,
  };

  return (
    <ProviderContext.Provider value={exportData}>
      {children}
    </ProviderContext.Provider>
  );
};

export default ProviderContextComponent;
