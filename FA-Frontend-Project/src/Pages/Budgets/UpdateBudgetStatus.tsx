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
import { useBudgetContext } from "@/Context/Budget/UseBudgetContext";
import { BudgetStatus } from "@/hooks/SalesInterfaces";
import { useState } from "react";

export const UpdateBudgetStatus = ({
  id,
  stockDecreased,
}: {
  id: number | undefined;
  stockDecreased: boolean | undefined;
}) => {
  const { updateBudgetStatus } = useBudgetContext();

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
    await updateBudgetStatus(status, id ?? 0);
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
