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
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  providerId: z.number(),
  categoryId: z.number(),
  name: z.string().min(5, {
    message: "El nombre debe contar con al menos 5 caracteres.",
  }),
  description: z.string().min(5, {
    message: "La descripción debe contar con al menos 5 caracteres.",
  }),
  price: z.number(),
  measures: z.string().min(1, {
    message: "Las medidas no pueden estar vacías.",
  }),
  saleUnit: z.string().min(1, {
    message: "La unidad de venta no puede estar vacía.",
  }),
  priceSaleUnit: z.number(),
  unitPerBox: z.number(),
  quality: z.string().min(1, {
    message: "La calidad no puede estar vacía.",
  }),
  discountPercentage: z.number() || null,
  discountedPrice: z.number() || null,
  // Not implemented
  images:
    z.array(z.string()).min(1, {
      message: "La imagen no puede estar vacía.",
    }) || null,
  tags:
    z.array(z.string()).min(1, {
      message: "El tag no puede estar vacío.",
    }) || null,
});

interface ProductsHeaderProps {
  setUpdateData: (value: boolean) => void;
  UpdateData: boolean;
}

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  setUpdateData,
  UpdateData,
}) => {
  const [Open, setOpen] = useState(false);

  const { BASE_URL } = useCatalogContext();
  const { getToken } = useKindeAuth();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (typeof getToken === "function") {
      const token = await getToken();
      try {
        const response = await fetch(`${BASE_URL}/product`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          console.error("Error: ", response.statusText);
          toast({
            variant: "destructive",
            title: `Error ${response.status}`,
            description: `Ocurrió un error al crear el producto.`,
          });
          return;
        }
        toast({
          title: "Producto creado",
          description: "El producto ha sido creado con éxito",
        });
        setUpdateData(!UpdateData);
      } catch (error) {
        console.error("Error: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al crear el producto",
        });
      } finally {
        setOpen(false);
      }
    } else return;
  }

  return (
    <section className="listHeader">
      <span></span>
      <Dialog open={Open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button className="text-lg">
            <CirclePlus />
            Nuevo Producto
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[80vw] w-full"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Añadir Producto
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full grid grid-rows-7 grid-cols-2 gap-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-1 row-span-1 ">
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del producto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-1 row-span-1">
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Descripción del producto"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="buttonDiv col-span-2 w-full">
                <Button type="submit" className="w-1/3">
                  Guardar
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </section>
  );
};
