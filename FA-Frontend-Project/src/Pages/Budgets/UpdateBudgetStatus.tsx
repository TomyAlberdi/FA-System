import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSalesContext } from "@/Context/UseSalesContext";
import { BudgetStatus } from "@/hooks/SalesInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useState } from "react";

export const UpdateBudgetStatus = ({
  id,
  stockDecreased,
  setOpenUpdateStatus,
  Reload,
  setReload,
}: {
  id: number | undefined;
  stockDecreased: boolean | undefined;
  setOpenUpdateStatus: (value: boolean) => void;
  Reload: boolean;
  setReload: (value: boolean) => void;
}) => {
  const { BASE_URL, fetchRegisterTotalAmount, fetchRecords } =
    useSalesContext();
  const { getToken } = useKindeAuth();

  const [updateStatus, setupdateStatus] = useState<string>("");

  const onUpdatePres = (status: string) => {
    if (
      (status === BudgetStatus.PAGO ||
        status === BudgetStatus.ENVIADO ||
        status === BudgetStatus.ENTREGADO) &&
      !stockDecreased
    ) {
      if (window.confirm("¿Desea actualizar el estado del presupuesto?")) {
        onSubmit(status);
      }
    } else {
      console.log(status);
      onSubmit(status);
    }
  };

  const onSubmit = async (status: string) => {
    const url = `${BASE_URL}/budget/${id}?status=${status}`;
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        if (response.status === 409) {
          const responseData = await response.json();
          window.alert(
            "Conflicto de Inventario\n. Los siguientes productos no tienen stock suficiente:\n" +
              responseData.join(", ")
          );
          return;
        }
        window.alert(
          `Error actualizando el estado del presupuesto: ${response.status}`
        );
        return;
      }
      window.alert("El estado del presupuesto ha sido actualizado con éxito");
      fetchRegisterTotalAmount();
      fetchRecords();
    } catch (error) {
      console.error("Error: ", error);
      window.alert("Ocurrió un error al actualizar el estado del presupuesto");
    } finally {
      setOpenUpdateStatus(false);
      setReload(!Reload);
    }
  };

  return (
    <DialogContent
      className="w-[90%] md:w-full md:p-6 p-3 rounded-lg"
      aria-describedby={undefined}
    >
      <DialogTitle>Actualizar estado del presupuesto</DialogTitle>
      <div>
        <Label>Estado</Label>
        <Select onValueChange={(value) => setupdateStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDIENTE" className="cursor-pointer">
              Pendiente
            </SelectItem>
            <SelectItem value="PAGO" className="cursor-pointer">
              Pago
            </SelectItem>
            <SelectItem value="ENVIADO" className="cursor-pointer">
              Enviado
            </SelectItem>
            <SelectItem value="ENTREGADO" className="cursor-pointer">
              Entregado
            </SelectItem>
            <SelectItem value="CANCELADO" className="cursor-pointer">
              Cancelado
            </SelectItem>
          </SelectContent>
        </Select>
        <Button
          className="w-full mt-4"
          onClick={() => onUpdatePres(updateStatus)}
        >
          Actualizar
        </Button>
      </div>
    </DialogContent>
  );
};
