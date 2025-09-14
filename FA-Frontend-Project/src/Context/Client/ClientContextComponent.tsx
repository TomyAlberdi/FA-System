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
import { useNavigate } from "react-router-dom";

interface ClientContextComponentProps {
  children: ReactNode;
}

const ClientContextComponent: React.FC<ClientContextComponentProps> = ({
  children,
}) => {
  const { getToken } = useKindeAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

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
        window.alert(
          "Ocurrió un error al obtener los clientes: " + response.status
        );
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
        window.alert(
          "Ocurrió un error al obtener el cliente: " + response.status
        );
        return;
      }
      const result: CompleteClient = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const [ClientUpdater, setClientUpdater] = useState(0);

  const createClient = async (dto: CreateClientDTO) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const finalDTO = {
        ...dto,
        "cuit_dni": dto.cuitDni,
      };
      console.log(finalDTO);
      const response = await fetch(`${BASE_URL}/client`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalDTO),
      });
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        window.alert(
          "Ocurrió un error al crear el cliente: " + response.status
        );
      }
      setClientUpdater((prev) => prev + 1);
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
      const finalDTO = {
        ...dto,
        cuit_dni: dto.cuitDni,
      };
      const response = await fetch(`${BASE_URL}/client/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalDTO),
      });
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        window.alert(
          "Ocurrió un error al actualizar el cliente: " + response.status
        );
        return;
      }
      setClientUpdater((prev) => prev + 1);
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
        window.alert(
          "Ocurrió un error al eliminar el cliente: " + response.status
        );
      }
      navigate(-1);
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
    ClientUpdater,
  };

  return (
    <ClientContext.Provider value={exportData}>
      {children}
    </ClientContext.Provider>
  );
};

export default ClientContextComponent;
