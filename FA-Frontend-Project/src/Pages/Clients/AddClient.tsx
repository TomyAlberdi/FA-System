import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSalesContext } from "@/Context/UseSalesContext";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { CirclePlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe contar con al menos 3 caracteres.",
  }),
  type: z.enum(["A", "B"], {
    required_error: "Seleccione un tipo de cliente.",
  }),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
  cuitDni: z.string(),
});

interface AddClientProps {
  handleRefresh: () => void;
}

export const AddClient = ({ handleRefresh }: AddClientProps) => {
  const [Open, setOpen] = useState(false);
  const [LoadingRequest, setLoadingRequest] = useState(false);
  const { BASE_URL } = useSalesContext();
  const { getToken } = useKindeAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      cuitDni: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const url = `${BASE_URL}/client`;
    setLoadingRequest(true);
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(url, {
        method: "POST",
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
          description: `Ocurrió un error al crear el cliente.`,
        });
        return;
      }
      toast({
        title: "Cliente creado",
        description: "El cliente ha sido creado con éxito",
      });
    } catch (error) {
      console.error("Error: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al crear el cliente",
      });
    } finally {
      setOpen(false);
      setLoadingRequest(false);
      handleRefresh();
    }
  }

  return (
    <Dialog open={Open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-lg">
          <CirclePlus />
          Nuevo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[500px] w-full"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Añadir Cliente
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
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
                    <Input
                      type="number"
                      {...field}
                    />
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
                    <Input
                      type="email"
                      {...field}
                    />
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
                    <Input
                      type="number"
                      {...field}
                    />
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
