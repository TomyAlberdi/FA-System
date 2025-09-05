import {
  ClientContext,
  ClientContextType,
} from "@/Context/Client/ClientContext";
import { ReturnData } from "@/hooks/CatalogInterfaces";
import {
  CompleteClient,
  CreateClientDTO,
  PartialClient,
} from "@/hooks/SalesInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { ReactNode, useState } from "react";

interface ClientContextComponentProps {
  children: ReactNode;
}

const ClientContextComponent: React.FC<ClientContextComponentProps> = ({
  children,
}) => {
  const { getToken } = useKindeAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [Clients, setClients] = useState<ReturnData<PartialClient>>({
    Loading: true,
    data: Array<PartialClient>(),
  });

  const fetchClients = async () => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/client/list`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        return;
      }
      const result: Array<PartialClient> = await response.json();
      setClients({ Loading: false, data: result });
    } catch (error) {
      console.error("Error fetching clients: ", error);
      setClients({ Loading: false, data: [] });
    }
  };

  const fetchClient = async (id: number) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/client/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        return;
      }
      const result: CompleteClient = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const createClient = async (dto: CreateClientDTO) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/client`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        return;
      }
      return;
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const updateClient = async (id: number, dto: CreateClientDTO) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/client/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        return;
      }
      return;
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const deleteClient = async (id: number) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/client/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        return;
      }
      return;
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const exportData: ClientContextType = {
    Clients,
    fetchClients,
    fetchClient,
    createClient,
    updateClient,
    deleteClient,
  };

  return (
    <ClientContext.Provider value={exportData}>
      {children}
    </ClientContext.Provider>
  );
};

export default ClientContextComponent;
