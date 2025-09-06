import {
  CashRegisterContext,
  CashRegisterContextType,
} from "@/Context/CashRegister/CashRegisterContext";
import { createCashRegisterRecordDTO, RegisterRecord } from "@/hooks/SalesInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { ReactNode, useEffect, useState } from "react";

interface CashRegisterContextComponentProps {
  children: ReactNode;
}

const CashRegisterContextComponent: React.FC<
  CashRegisterContextComponentProps
> = ({ children }) => {
  const { getToken } = useKindeAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [CashRegisterTotalAmount, setCashRegisterTotalAmount] = useState(0);
  const fetchCashRegisterTotalAmount = async () => {
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
      setCashRegisterTotalAmount(Number(result.toFixed(2)));
    } catch (error) {
      console.error("Error fetching cash register: ", error);
    }
  };

  const [RegisterTypes, setRegisterTypes] = useState<Array<number>>([0, 0]);
  const fetchCashRegisterTypes = async (yearMonth: string) => {
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

  const createRecord = async (record: createCashRegisterRecordDTO) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/cash-register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(record),
      });
      if (!response.ok) {
        console.error("Error fetching cash register: ", response.statusText);
        return;
      }
      return;
    } catch (error) {
      console.error("Error fetching cash register: ", error);
    }
  };

  const getRecordsByDate = async (date: string) => {
    const url = `${BASE_URL}/cash-register/${date}`;
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
      const result: Array<RegisterRecord> = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching cash register: ", error);
    }
  };

  const deleteRecord = async (id: number) => {
    const url = `${BASE_URL}/cash-register/${id}`;
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error deleting record: ", response.statusText);
        window.alert(`Error eliminando el registro: ${response.status}`);
        return;
      }
      window.alert("El registro ha sido eliminado con éxito.");
    } catch (error) {
      console.error("Error deleting record: ", error);
      window.alert("Ocurrió un error al eliminar el registro.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (getToken) {
        const accessToken = await getToken();
        if (accessToken) {
          fetchCashRegisterTotalAmount();
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken]);

  const exportData: CashRegisterContextType = {
    fetchCashRegisterTotalAmount,
    CashRegisterTotalAmount,
    fetchCashRegisterTypes,
    RegisterTypes,
    FormattedDate,
    setFormattedDate,
    createRecord,
    getRecordsByDate,
    deleteRecord,
  };

  return (
    <CashRegisterContext.Provider value={exportData}>
      {children}
    </CashRegisterContext.Provider>
  );
};

export default CashRegisterContextComponent;
