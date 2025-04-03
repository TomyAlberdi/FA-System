import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  status: z.string(),
});

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
  const { BASE_URL, fetchRegisterTotalAmount } = useSalesContext();
  const { getToken } = useKindeAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: status,
    },
  });

  const onUpdatePres = (data: z.infer<typeof formSchema>) => {
    if (
      (data.status === BudgetStatus.PAGO ||
        data.status === BudgetStatus.ENVIADO ||
        data.status === BudgetStatus.ENTREGADO) &&
      !stockDecreased
    ) {
      toast({
        variant: "destructive",
        title: "¿Confirmar actualización?",
        description: `Actualizar el presupuesto a ${data.status} modificará el stock de los productos.`,
        action: (
          <ToastAction altText="Actualizar" onClick={() => onSubmit(data)}>
            Actualizar
          </ToastAction>
        ),
      });
    } else {
      console.log(data);
      onSubmit(data);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const url = `${BASE_URL}/budget/${id}?status=${data.status}`;
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
      className="sm:max-w-[500px] w-full p-6"
      aria-describedby={undefined}
    >
      <DialogTitle>Actualizar estado del presupuesto</DialogTitle>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onUpdatePres)}>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un estado" />
                    </SelectTrigger>
                  </FormControl>
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
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full mt-4">
            Actualizar
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
};
