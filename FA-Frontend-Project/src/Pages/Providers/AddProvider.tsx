import { Button } from "@/components/ui/button";
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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
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

interface CategoriesHeaderProps {
  setUpdateData?: (value: boolean) => void;
  UpdateData?: boolean;
  setOpen: (value: boolean) => void;
}

export const AddProvider: React.FC<CategoriesHeaderProps> = ({
  setUpdateData,
  UpdateData,
  setOpen,
}) => {
  const [LoadingRequest, setLoadingRequest] = useState(false);
  const { BASE_URL } = useCatalogContext();
  const { getToken } = useKindeAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      locality: "",
      address: "",
      phone: "",
      email: "",
      cuit: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      setLoadingRequest(true);
      const response = await fetch(`${BASE_URL}/provider`, {
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
          description: `Ocurrió un error al crear el proveedor.`,
        });
        return;
      }
      toast({
        title: "Proveedor creado",
        description: "El proveedor ha sido creado con éxito",
      });
      if (setUpdateData) {
        setUpdateData(!UpdateData);
      }
    } catch (error) {
      console.error("Error: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al crear el proveedor",
      });
    } finally {
      setLoadingRequest(false);
      setOpen(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full grid grid-cols-2 grid-rows-4 gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-start-1 row-start-1">
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del proveedor" {...field} />
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
                <Input placeholder="Localidad del proveedor" {...field} />
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
                <Input placeholder="Dirección del proveedor" {...field} />
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
                <Input placeholder="Teléfono del proveedor" {...field} />
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
                <Input placeholder="Email del proveedor" {...field} />
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
                <Input placeholder="CUIT del proveedor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-2 col-start-1 flex justify-center items-center">
          <Button type="submit" className="w-full" disabled={LoadingRequest}>
            {LoadingRequest && <Loader2 className="animate-spin" />}
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
};
