import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompleteClient } from "@/hooks/SalesInterfaces";
import { useSalesContext } from "@/Context/UseSalesContext";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  id: z.number(),
  name: z.string().min(3, {
    message: "El nombre debe contar con al menos 3 caracteres.",
  }),
  type: z.enum(["A", "B"], {
    required_error: "Seleccione un tipo de cliente.",
  }),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  cuitDni: z.string().optional(),
});

export const UpdateClient = ({ client, Reload, setReload }: { client: CompleteClient, Reload: boolean, setReload: (value: boolean) => void }) => {
  const [Open, setOpen] = useState(false);
  const [LoadingRequest, setLoadingRequest] = useState(false);
  const { getToken } = useKindeAuth();
  const { BASE_URL } = useSalesContext();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    form.reset({
      id: client?.id ?? 0,
      name: client?.name ?? "",
      type: (client?.type as "A" | "B") ?? "A",
      address: client?.address ?? "",
      phone: client?.phone ?? "",
      email: client?.email ?? "",
      cuitDni: client?.cuitDni ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const updateClient = async (data: z.infer<typeof formSchema>) => {
    setLoadingRequest(true);
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/client`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        console.error("Error: ", response.statusText);
        toast({
          variant: "destructive",
          title: `Error ${response.status}`,
          description: `Ocurrió un error al actualizar el cliente.`,
        });
        return;
      }
      toast({
        title: "Cliente actualizado",
        description: "El cliente ha sido actualizado con éxito",
      });
      setReload(!Reload);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al actualizar el cliente",
      });
    } finally {
      setLoadingRequest(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={Open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mb-2">
          <Pencil />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[500px] w-full"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Editar Cliente
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(updateClient)}
            className="w-full grid grid-cols-2 grid-rows-5 gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-start-1 row-start-1">
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-start-1 row-start-2">
                  <FormLabel>Dirección (Opcional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="col-start-2 row-start-1">
                  <FormLabel>Teléfono (Opcional)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-start-2 row-start-2">
                  <FormLabel>Email (Opcional)</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cuitDni"
              render={({ field }) => (
                <FormItem className="col-start-1 row-start-3 col-span-2">
                  <FormLabel>CUIT / DNI (Opcional)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="col-start-1 row-start-4 col-span-2">
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="A" id="A" />
                        <Label htmlFor="A">
                          Responsable Inscripto (Tipo A)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="B" id="B" />
                        <Label htmlFor="B">Consumidor Final (Tipo B)</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-2 col-start-1 flex justify-center items-center">
              <Button
                type="submit"
                className="w-full"
                disabled={LoadingRequest}
              >
                {LoadingRequest && <Loader2 className="animate-spin" />}
                Guardar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
