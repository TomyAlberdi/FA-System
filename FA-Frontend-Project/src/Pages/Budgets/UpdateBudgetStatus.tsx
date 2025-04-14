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
import { ToastAction } from "@/components/ui/toast";
import { useSalesContext } from "@/Context/UseSalesContext";
import { BudgetStatus } from "@/hooks/SalesInterfaces";
import { useToast } from "@/hooks/use-toast";
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
  const { BASE_URL, fetchRegisterTotalAmount, fetchRecords } = useSalesContext();
  const { getToken } = useKindeAuth();
  const { toast } = useToast();

  const [updateStatus, setupdateStatus] = useState<string>("");

  const onUpdatePres = (status: string) => {
    if (
      (status === BudgetStatus.PAGO ||
        status === BudgetStatus.ENVIADO ||
        status === BudgetStatus.ENTREGADO) &&
      !stockDecreased
    ) {
      toast({
        variant: "destructive",
        title: "¿Confirmar actualización?",
        description: `Actualizar el presupuesto a ${status} modificará el stock de los productos y la caja registradora.`,
        action: (
          <ToastAction altText="Actualizar" onClick={() => onSubmit(status)}>
            Actualizar
          </ToastAction>
        ),
      });
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
          toast({
            variant: "destructive",
            title: "Conflicto de Inventario",
            description: `Los siguientes productos no tienen stock suficiente: ${responseData.join(
              ", "
            )}`,
          });
          return;
        }
        toast({
          variant: "destructive",
          title: `Error ${response.status}`,
          description: `Ocurrió un error al actualizar el estado del presupuesto.`,
        });
        return;
      }
      toast({
        title: "Estado actualizado",
        description: "El estado del presupuesto ha sido actualizado con éxito",
      });
      fetchRegisterTotalAmount();
      fetchRecords()
    } catch (error) {
      console.error("Error: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al actualizar el estado del presupuesto",
      });
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
