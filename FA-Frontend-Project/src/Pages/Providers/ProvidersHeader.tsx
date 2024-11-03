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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader
} from "@/components/ui/dialog";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe contar con al menos 3 caracteres.",
  }),
});

interface ProvidersHeaderProps {
  setUpdateData: (value: boolean) => void;
  UpdateData: boolean;
}

export const ProvidersHeader: React.FC<ProvidersHeaderProps> = ({
  setUpdateData,
  UpdateData,
}) => {
  const [open, setOpen] = useState(false);
  const { BASE_URL } = useCatalogContext();
  const { getToken } = useKindeAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (typeof getToken === "function") {
      const token = await getToken();
      try {
        const response = await fetch(`${BASE_URL}/provider/${data.name}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
        setUpdateData(!UpdateData);
      } catch (error) {
        console.error("Error: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al crear el proveedor",
        });
      } finally {
        setOpen(false);
      }
    } else return;
  }

  return (
    <section className="listHeader">
      <h1 className="sectionTitle">Proveedores</h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="text-lg">
            <CirclePlus />
            Nuevo Proveedor
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[500px] w-full"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Añadir Proveedor
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del proveedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Guardar</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </section>
  );
};
