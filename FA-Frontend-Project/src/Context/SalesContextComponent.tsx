import { SalesContext, SalesContextType } from "@/Context/SalesContext";
import {
  CompleteBudget,
  CompleteClient,
  PartialBudget,
  PartialClient,
} from "@/hooks/SalesInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useEffect, useState } from "react";

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
      return result || [];
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
      return result || [];
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

  /// CASH REGISTER GET ///
  const [RegisterTotalAmount, setRegisterTotalAmount] = useState(0);
  const fetchRegisterTotalAmount = async () => {
    const url = `${BASE_URL}/cash-register/total`;
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
        console.error("Error fetching cash register: ", response.statusText);
        return;
      }
      const result: number = await response.json();
      setRegisterTotalAmount(Number(result.toFixed(2)));
    } catch (error) {
      console.error("Error fetching cash register: ", error);
    }
  };

  const [RegisterTypes, setRegisterTypes] = useState<Array<number>>([0, 0]);
  const fetchRegisterTypes = async (yearMonth: string) => {
    const url = `${BASE_URL}/cash-register/types/${yearMonth}`;
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
        console.error("Error fetching cash register: ", response.statusText);
        return;
      }
      const result: Array<number> = await response.json();
      const formattedResult = result.map((num) => Number(num.toFixed(2)));
      setRegisterTypes(formattedResult);
    } catch (error) {
      console.error("Error fetching cash register: ", error);
    }
  };

  const [FormattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (getToken) {
        const accessToken = await getToken();
        if (accessToken) {
          fetchRegisterTotalAmount();
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken]);

  const exportData: SalesContextType = {
    BASE_URL,
    fetchClient,
    fetchBudgetsByClient,
    fetchListOfClients,
    fetchCompleteBudget,
    fetchBudgetsByDate,
    fetchBudgetsByDateRange,
    fetchRegisterTotalAmount,
    RegisterTotalAmount,
    fetchRegisterTypes,
    RegisterTypes,
    FormattedDate,
    setFormattedDate,
  };

  return (
    <SalesContext.Provider value={exportData}>{children}</SalesContext.Provider>
  );
};

export default SalesContextComponent;
