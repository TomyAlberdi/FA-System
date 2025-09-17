import {
  ClientContext,
  ClientContextType,
} from "@/Context/Client/ClientContext";
import {
  CompleteClient,
  CreateClientDTO,
  PartialClient,
} from "@/hooks/SalesInterfaces";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface ClientContextComponentProps {
  children: ReactNode;
}

const ClientContextComponent: React.FC<ClientContextComponentProps> = ({
  children,
}) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
        const response = await fetch(`${BASE_URL}/client/list`);
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        window.alert(
          "Ocurrió un error al obtener los clientes: " + response.status
        );
        return [];
      }
      const result: Array<PartialClient> = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching clients: ", error);
      return [];
    }
  };

  const fetchClient = async (id: number) => {
    try {
        const response = await fetch(`${BASE_URL}/client/${id}`);
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

  const createClient = async (dto: CreateClientDTO) => {
    try {
      const finalDTO = {
        ...dto,
        cuit_dni: dto.cuitDni,
      };
      console.log(finalDTO);
      const response = await fetch(`${BASE_URL}/client`, {
        method: "POST",
        headers: {
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
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const updateClient = async (id: number, dto: CreateClientDTO) => {
    try {
      const finalDTO = {
        ...dto,
        cuit_dni: dto.cuitDni,
      };
      const response = await fetch(`${BASE_URL}/client/${id}`, {
        method: "PUT",
        headers: {
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
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const deleteClient = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/client/${id}`, {
        method: "DELETE",
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
