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
import { Select } from "@/components/ui/select";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
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
  measureUnit: z.string({required_error: "Seleccione una unidad de medida"}),
  measures: z.string().optional(),
  priceMeasureUnit: z.number(),
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

export const AddProduct = () => {
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
      } catch (error) {
        console.error("Error: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al crear el producto",
        });
      }
    } else return;
  }

  return (
    <div className="AddProduct">
      <h1 className="sectionTitle">Añadir Producto</h1>
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
              <FormItem className="col-span-1 row-span-1 row-start-2">
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input placeholder="Descripción del producto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Measures data */}
          <FormField
            control={form.control}
            name="measureUnit"
            render={({ field }) => (
              <FormItem className="col-span-1 row-span-1 row-start-1 col-start-2">
                <FormLabel>Unidad de medida del producto</FormLabel>
                <Select {...field}>
                  <option value="1">1 Unidad</option>
                  <option value="2">2 Unidades</option>
                  <option value="3">3 Unidades</option>
                  <option value="4">4 Unidades</option>
                  <option value="5">5 Unidades</option>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="measures"
            render={({ field }) => (
              <FormItem className="col-span-1 row-span-1 row-start-2 col-start-2">
                <FormLabel>Medidas (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: 20x20" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priceMeasureUnit"
            render={({ field }) => (
              <FormItem className="col-span-1 row-span-1 row-start-3 col-start-2">
                <FormLabel>Precio por unidad de medida</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: 25000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unitPerBox"
            render={({ field }) => (
              <FormItem className="col-span-1 row-span-1 row-start-4 col-start-2">
                <FormLabel>Cantidad de unidades de venta</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: 100 M2 por caja" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Sale unit data */}
          <FormField
            control={form.control}
            name="saleUnit"
            render={({ field }) => (
              <FormItem className="col-span-1 row-span-1 row-start-3">
                <FormLabel>Unidad de venta</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Caja, Pieza" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="col-span-1 row-span-1 row-start-4">
                <FormLabel>Precio por unidad de venta</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Precio por caja" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="buttonDiv col-span-2 w-full flex justify-center items-center row-start-7">
            <Button type="submit" className="w-1/3">
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
