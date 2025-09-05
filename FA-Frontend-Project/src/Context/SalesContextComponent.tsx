import { SalesContext, SalesContextType } from "@/Context/SalesContext";
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
