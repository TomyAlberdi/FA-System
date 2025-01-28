import { SalesContext, SalesContextType } from "@/Context/SalesContext";
import {
  CompleteBudget,
  CompleteClient,
  PartialBudget,
  PartialClient,
} from "@/hooks/SalesInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

interface SalesContextComponentProps {
  children: React.ReactNode;
}

const SalesContextComponent: React.FC<SalesContextComponentProps> = ({
  children,
}) => {
  const { getToken } = useKindeAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  /// CLIENT GET ///

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

  const fetchListOfClients = async () => {
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
        console.error("Error fetching clients: ", response.statusText);
        return;
      }
      const result: Array<PartialClient> = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching clients: ", error);
    }
  };

  /// BUDGET GET ///
  const fetchBudgetsByClient = async (id: number) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/budget/client/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching client budgets: ", response.statusText);
        return;
      }
      const result: Array<PartialBudget> = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching client budgets: ", error);
    }
  };

  const fetchCompleteBudget = async (id: number) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/budget/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching budget: ", response.statusText);
        return;
      }
      const result: CompleteBudget = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching budget: ", error);
    }
  };

  const exportData: SalesContextType = {
    BASE_URL,
    fetchClient,
    fetchBudgetsByClient,
    fetchListOfClients,
    fetchCompleteBudget,
  };

  return (
    <SalesContext.Provider value={exportData}>{children}</SalesContext.Provider>
  );
};

export default SalesContextComponent;
