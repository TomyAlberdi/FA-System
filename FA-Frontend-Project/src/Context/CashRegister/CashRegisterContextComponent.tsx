import {
  CashRegisterContext,
  CashRegisterContextType,
} from "@/Context/CashRegister/CashRegisterContext";
import {
  createCashRegisterRecordDTO,
  RegisterRecord,
} from "@/hooks/SalesInterfaces";
import { ReactNode, useEffect, useState } from "react";

interface CashRegisterContextComponentProps {
  children: ReactNode;
}

const CashRegisterContextComponent: React.FC<
  CashRegisterContextComponentProps
> = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [CashRegisterTotalAmount, setCashRegisterTotalAmount] = useState(0);
  const fetchCashRegisterTotalAmount = async () => {
    const url = `${BASE_URL}/cash-register/total`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Error fetching cash register: ", response.statusText);
        window.alert(
          "Ocurrió un error al obtener la caja registradora: " + response.status
        );
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
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Error fetching cash register: ", response.statusText);
        window.alert(
          "Ocurrió un error al obtener la caja registradora: " + response.status
        );
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
  const [CashRegisterUpdater, setCashRegisterUpdater] = useState(0);

  const createRecord = async (record: createCashRegisterRecordDTO) => {
    try {
      const response = await fetch(`${BASE_URL}/cash-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      });
      if (!response.ok) {
        console.error("Error fetching cash register: ", response.statusText);
        window.alert(
          "Ocurrió un error al registrar en la caja: " + response.status
        );
        return;
      }
      setCashRegisterUpdater((prev) => prev + 1);
      window.alert("Registro creado con éxito");
      await fetchCashRegisterTotalAmount();
    } catch (error) {
      console.error("Error fetching cash register: ", error);
    }
  };

  const getRecordsByDate = async (date: string) => {
    const url = `${BASE_URL}/cash-register/${date}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Error fetching cash register: ", response.statusText);
        window.alert(
          "Ocurrió un error al obtener la caja registradora: " + response.status
        );
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
      const response = await fetch(url, {
        method: "DELETE",
      });
      if (!response.ok) {
        console.error("Error deleting record: ", response.statusText);
        window.alert(`Error eliminando el registro: ${response.status}`);
        return;
      }
      setCashRegisterUpdater((prev) => prev + 1);
    } catch (error) {
      console.error("Error deleting record: ", error);
      window.alert("Ocurrió un error al eliminar el registro.");
    }
  };

  useEffect(() => {
    fetchCashRegisterTotalAmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    CashRegisterUpdater,
  };

  return (
    <CashRegisterContext.Provider value={exportData}>
      {children}
    </CashRegisterContext.Provider>
  );
};

export default CashRegisterContextComponent;
