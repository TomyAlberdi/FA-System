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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Category, Provider, Subcategory } from "@/hooks/CatalogInterfaces";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  // Base data
  name: z.string().min(5, {
    message: "El nombre debe contar con al menos 5 caracteres.",
  }),
  description: z.string().min(5, {
    message: "La descripción debe contar con al menos 5 caracteres.",
  }),
  quality: z.string() || null,
  // Measure data
  measureUnit: z.string({ required_error: "Seleccione una unidad de medida" }),
  measures: z.string() || null,
  priceMeasureUnit: z.number(),
  // Sale unit data
  saleUnit: z.string().min(1, {
    message: "La unidad de venta no puede estar vacía.",
  }),
  saleUnitPrice: z.number(),
  measurePerSaleUnit: z.number() || null,
  // Discount data
  discountPercentage: z.number() || null,
  discountedPrice: z.number() || null,
  // External data
  providerId: z.string(),
  categoryId: z.string(),
  subcategoryId: z.string() || null,
  images:
    z.array(z.string()).min(1, {
      message: "La imagen no puede estar vacía.",
    }) || null,
});

export const AddProduct = () => {
  const {
    BASE_URL,
    fetchProviders,
    fetchCategories,
    fetchSubcategoriesByCategoryId,
  } = useCatalogContext();
  const { getToken } = useKindeAuth();
  const { toast } = useToast();

  const [Providers, setProviders] = useState<Array<Provider>>([]);
  const [Categories, setCategories] = useState<Array<Category>>([]);
  const [Subcategories, setSubcategories] = useState<Array<Subcategory>>([]);

  useEffect(() => {
    fetchProviders().then((result) => setProviders(result ?? []));
    fetchCategories().then((result) => setCategories(result ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  useEffect(() => {
    if (selectedCategoryId) {
      fetchSubcategoriesByCategoryId(parseInt(selectedCategoryId)).then(
        (result) => setSubcategories(result ?? [])
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/product`, {
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
  }

  return (
    <div className="AddProduct">
      <h1 className="sectionTitle">Añadir Producto</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={
            "w-full grid grid-cols-2 gap-4 " +
            (Subcategories?.length > 0 ? "grid-rows-11" : "grid-rows-9")
          }
        >
          {/* Basic data */}
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
          <FormField
            control={form.control}
            name="quality"
            render={({ field }) => (
              <FormItem className="col-span-1 row-span-1 row-start-3">
                <FormLabel>Calidad (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: 1ra" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Provider, Category and Subcategory data */}
          <FormField
            control={form.control}
            name="providerId"
            render={({ field }) => (
              <FormItem className="col-span-1 row-span-1 row-start-4 row-end-5">
                <FormLabel>Proveedor</FormLabel>
                <FormControl>
                  <Select {...field} defaultValue="1">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="1" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Providers?.map((provider: Provider) => {
                        return (
                          <SelectItem value={provider.id.toString()}>
                            {provider.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <section className="col-span-1 row-span-1 row-start-5 row-end-6">
            <Label htmlFor="subcategoryId">Categoría</Label>
            <Select
              name="categoryId"
              onValueChange={(value) => setSelectedCategoryId(value)}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Categories?.map((category: Category) => {
                  return (
                    <SelectItem value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </section>
          {Subcategories?.length > 0 && (
            <section className="col-span-1 row-span-1 row-start-6 row-end-7">
              <Label htmlFor="subcategoryId">Subcategoría</Label>
              <Select name="subcategoryId">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Subcategories?.map((subcategory: Subcategory) => {
                    return (
                      <SelectItem value={subcategory.id.toString()}>
                        {subcategory.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </section>
          )}
          <div
            className={
              "imageSection col-start-1 pg-4 bg-primary-foreground rounded " +
              (Subcategories?.length > 0
                ? "row-start-7 row-end-9"
                : "row-start-6 row-end-8")
            }
          >
            images
          </div>
          {/* Measures data */}
          <div className="measureSection row-span-3 row-start-1 row-end-4 col-start-2 p-4 bg-primary-foreground rounded">
            <FormField
              control={form.control}
              name="measureUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad de medida del producto</FormLabel>
                  <Select {...field} defaultValue="M2">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="M2" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="M2">M2</SelectItem>
                      <SelectItem value="Pieza">Pieza</SelectItem>
                      <SelectItem value="Juego">Juego</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="measures"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
                  <FormLabel className="flex justify-start align-center pt-2">
                    Precio de unidad de medida
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 ml-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Ejemplos: <br />
                          - Precio por M2: 10000 <br />
                          - Precio por Pieza: 5000 <br />
                          - Precio por Juego: 1000 <br />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 25000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Sale unit data */}
          <div className="saleUnitSection row-span-3 row-start-4 row-end-7 col-start-2 p-4 bg-primary-foreground rounded">
            <FormField
              control={form.control}
              name="saleUnit"
              render={({ field }) => (
                <FormItem className="col-start-2 row-span-1 row-start-4">
                  <FormLabel>Unidad de venta</FormLabel>
                  <Select {...field} defaultValue="Caja">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Caja" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Caja">Caja</SelectItem>
                      <SelectItem value="Pieza">Pieza</SelectItem>
                      <SelectItem value="Juego">Juego</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="measurePerSaleUnit"
              render={({ field }) => (
                <FormItem className="row-start-5 col-start-2">
                  <FormLabel className="flex justify-start align-center pt-2">
                    Cantidad de unidades
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 ml-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Ejemplos: <br />
                          - M2 por Caja: 25 <br />
                          - Unidades por Juego: 5 <br />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="saleUnitPrice"
              render={({ field }) => (
                <FormItem className="col-span-1 row-span-1 row-start-6">
                  <FormLabel className="flex justify-start align-center pt-2">
                    Precio por unidad de venta
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 ml-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Ejemplos: <br />
                          - Precio por Caja: 10000 <br />
                          - Precio por Pieza: 5000 <br />
                          - Precio por Juego: 1000 <br />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 10000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Discount data */}
          <div className="discountSection row-span-2 row-start-7 row-end-9 col-start-2 p-4 bg-primary-foreground rounded">
            <FormField
              control={form.control}
              name="discountPercentage"
              render={({ field }) => (
                <FormItem className="col-start-2 row-start-1">
                  <FormLabel>Porcentaje de descuento (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Submit button */}
          <div className="buttonDiv col-span-2 w-full flex justify-center items-center row-start-11">
            <Button type="submit" className="w-1/3">
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
