import {
  BudgetContext,
  BudgetContextType,
} from "@/Context/Budget/BudgetContext";
import {
  CompleteBudget,
  CreateBudgetDTO,
  PartialBudget,
} from "@/hooks/SalesInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { ReactNode } from "react";

interface BudgetContextComponentProps {
  children: ReactNode;
}

const BudgetContextComponent: React.FC<BudgetContextComponentProps> = ({
  children,
}) => {
  const { getToken } = useKindeAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

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

  const fetchBudget = async (id: number) => {
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

  const fetchBudgetsByDate = async (date: string) => {
    const url = `${BASE_URL}/budget/date/${date}`;
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching budgets: ", response.statusText);
        return;
      }
      const result: Array<PartialBudget> = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching budgets: ", error);
    }
  };

  const fetchBudgetsByDateRange = async (start: string, end: string) => {
    const url = `${BASE_URL}/budget/range?start=${start}&end=${end}`;
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching budgets: ", response.statusText);
        return;
      }
      const result: Array<PartialBudget> = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching budgets: ", error);
    }
  };

  const createBudget = async (dto: CreateBudgetDTO, clientId?: number) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      let url = `${BASE_URL}/budget`;
      if (clientId) {
        url = `${url}?clientId=${clientId}`;
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) {
        console.error("Error fetching budget: ", response.statusText);
        return;
      }
      return;
    } catch (error) {
      console.error("Error fetching budget: ", error);
    }
  };

  const updateBudget = async (
    dto: CreateBudgetDTO,
    budgetId: number,
    clientId?: number
  ) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      let url = `${BASE_URL}/budget?budgetId=${budgetId}`;
      if (clientId) {
        url = `${url}&clientId=${clientId}`;
      }
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) {
        console.error("Error fetching budget: ", response.statusText);
        return;
      }
      return;
    } catch (error) {
      console.error("Error fetching budget: ", error);
    }
  };

  const updateBudgetStatus = async (status: string, budgetId: number) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(
        `${BASE_URL}/budget/${budgetId}?status=${status}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) {
        console.error("Error fetching budget: ", response.statusText);
        return;
      }
      return;
    } catch (error) {
      console.error("Error fetching budget: ", error);
    }
  };

  const deleteBudget = async (budgetId: number) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/budget/${budgetId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching budget: ", response.statusText);
        return;
      }
      return;
    } catch (error) {
      console.error("Error fetching budget: ", error);
    }
  };

  const exportData: BudgetContextType = {
    fetchBudgetsByClient,
    fetchBudget,
    fetchBudgetsByDate,
    fetchBudgetsByDateRange,
    createBudget,
    updateBudget,
    updateBudgetStatus,
    deleteBudget,
  };

  return (
    <BudgetContext.Provider value={exportData}>
      {children}
    </BudgetContext.Provider>
  );
};

export default BudgetContextComponent;
