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
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Provider as ProviderInterface } from "@/hooks/CatalogInterfaces";

const formSchema = z.object({
  id: z.number(),
  name: z.string().min(3, {
    message: "El nombre debe contar con al menos 3 caracteres.",
  }),
  locality: z.string().min(3, {
    message: "La localidad debe contar con al menos 3 caracteres.",
  }),
  address: z.string().min(3, {
    message: "La dirección debe contar con al menos 3 caracteres.",
  }),
  phone: z.string().min(10, {
    message: "El teléfono debe contar con al menos 10 caracteres.",
  }),
  email: z.string().email({
    message: "El email no es válido.",
  }),
  cuit: z.string().length(11, {
    message: "El CUIT debe contar con 11 caracteres.",
  }),
});

export const UpdateProvider = ({
  provider,
  Open,
  setOpen,
}: {
  provider: ProviderInterface | null;
  Open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const [LoadingRequest, setLoadingRequest] = useState(false);
  const { BASE_URL } = useCatalogContext();
  const { toast } = useToast();
  const { getToken } = useKindeAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    form.reset({
      id: provider?.id ?? 0,
      name: provider?.name ?? "",
      locality: provider?.locality ?? "",
      address: provider?.address ?? "",
      phone: provider?.phone ?? "",
      email: provider?.email ?? "",
      cuit: provider?.cuit ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const updateProvider = async (data: z.infer<typeof formSchema>) => {
    setLoadingRequest(true);
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/provider`, {
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
          description: `Ocurrió un error al actualizar el proveedor.`,
        });
        return;
      }
      toast({
        title: "Proveedor actualizado",
        description: "El proveedor ha sido actualizada con éxito",
      });
    } catch (error) {
      console.error("Error: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al actualizar el proveedor",
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
            Editar proveedor
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(updateProvider)}
            className="w-full grid grid-cols-2 grid-rows-4 gap-4"
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
              name="locality"
              render={({ field }) => (
                <FormItem className="col-start-1 row-start-2">
                  <FormLabel>Localidad</FormLabel>
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
                <FormItem className="col-start-1 row-start-3">
                  <FormLabel>Dirección</FormLabel>
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
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cuit"
              render={({ field }) => (
                <FormItem className="col-start-2 row-start-3">
                  <FormLabel>CUIT</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
