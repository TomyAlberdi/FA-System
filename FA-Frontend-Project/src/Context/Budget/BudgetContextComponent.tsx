import {
  BudgetContext,
  BudgetContextType,
} from "@/Context/Budget/BudgetContext";
import {
  CompleteBudget,
  CreateBudgetDTO,
  PartialBudget,
  ProductBudget,
} from "@/hooks/SalesInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";

interface BudgetContextComponentProps {
  children: ReactNode;
}

const BudgetContextComponent: React.FC<BudgetContextComponentProps> = ({
  children,
}) => {
  const { getToken } = useKindeAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

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
        window.alert("Ocurrió un error al obtener los presupuestos: " + response.status);
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
        window.alert("Ocurrió un error al obtener el presupuesto: " + response.status);
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
        window.alert("Ocurrió un error al obtener los presupuestos: " + response.status);
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
        window.alert("Ocurrió un error al obtener los presupuestos: " + response.status);
        return;
      }
      const result: Array<PartialBudget> = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching budgets: ", error);
    }
  };

  const [BudgetUpdater, setBudgetUpdater] = useState(0);

  const createBudget = async (dto: CreateBudgetDTO, clientId?: number) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      let url = `${BASE_URL}/budget`;
      let cleanDTO: CreateBudgetDTO | null = null;
      if (clientId) {
        url = `${url}?clientId=${clientId}`;
        cleanDTO = {
          discount: dto.discount,
          products: dto.products,
          total: dto.total,
        };
      } else {
        cleanDTO = {
          discount: dto.discount,
          client: dto.client,
          products: dto.products,
          total: dto.total,
        };
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanDTO),
      });
      if (!response.ok) {
        console.error("Error fetching budget: ", response.statusText);
        window.alert("Ocurrió un error al crear el presupuesto: " + response.status);
        return;
      }
      window.alert("El presupuesto ha sido creado con éxito");
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) {
        console.error("Error fetching budget: ", response.statusText);
        window.alert("Ocurrió un error al actualizar el presupuesto: " + response.status);
        return;
      }
      window.alert("El presupuesto ha sido actualizado con éxito");
      setBudgetUpdater((prev) => prev + 1);
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) {
        if (response.status === 409) {
          const responseData = await response.json();
          window.alert(
            "Conflicto de Inventario.\nLos siguientes productos no tienen stock suficiente:\n" +
              responseData.join(", ")
          );
          return;
        }
        window.alert(
          `Error actualizando el estado del presupuesto: ${response.status}`
        );
        return;
      }
      window.alert("El estado del presupuesto ha sido actualizado con éxito.");
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
        window.alert("Ocurrió un error al eliminar el presupuesto: " + response.status);
        return;
      }
      window.alert("El presupuesto ha sido eliminado con éxito");
      navigate(-1);
    } catch (error) {
      console.error("Error fetching budget: ", error);
    }
  };

  // CART
  const BUDGET_STORAGE_KEY = "currentBudget";
  const [CurrentBudget, setCurrentBudget] = useState<CreateBudgetDTO>({
    client: undefined,
    clientId: undefined,
    discount: 0,
    products: [],
    total: 0,
  });
  const updateCurrentBudget = (budget: CreateBudgetDTO) => {
    let total = 0;
    const products = budget?.products ?? [];
    const initialDiscount = budget?.discount ?? 0;

    products.forEach((product: ProductBudget) => {
      if (product?.subtotal && product.subtotal > 0) {
        total += product.subtotal;
      }
    });
    let finalTotal = Math.round(total * 100) / 100;
    if (initialDiscount > 0) {
      finalTotal =
        Math.round(
          (total * (1 - initialDiscount / 100) + Number.EPSILON) * 100
        ) / 100;
    }
    const updated = {
      ...budget,
      total: finalTotal,
    };
    console.log(finalTotal);
    setCurrentBudget(updated);
    sessionStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  };
  const clearCurrentBudget = () => {
    sessionStorage.removeItem(BUDGET_STORAGE_KEY);
    setCurrentBudget({
      client: undefined,
      discount: 0,
      products: [],
      total: 0,
    });
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
    CurrentBudget,
    updateCurrentBudget,
    clearCurrentBudget,
    BudgetUpdater,
  };

  return (
    <BudgetContext.Provider value={exportData}>
      {children}
    </BudgetContext.Provider>
  );
};

export default BudgetContextComponent;
