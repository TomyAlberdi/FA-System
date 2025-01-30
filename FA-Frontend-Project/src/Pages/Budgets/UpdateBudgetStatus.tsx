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
import { useSalesContext } from "@/Context/UseSalesContext";
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
  setOpenUpdateStatus,
  Reload,
  setReload,
}: {
  id: number | undefined;
  setOpenUpdateStatus: (value: boolean) => void;
  Reload: boolean;
  setReload: (value: boolean) => void;
}) => {
  const { BASE_URL } = useSalesContext();
  const { getToken } = useKindeAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: status,
    },
  });

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
        console.error("Error: ", response.statusText);
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
      className="sm:max-w-[500px] w-full"
      aria-describedby={undefined}
    >
      <DialogTitle>Actualizar estado del presupuesto</DialogTitle>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
