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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ToastAction } from "@/components/ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { Category, Provider, Subcategory } from "@/hooks/CatalogInterfaces";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Info, Loader2, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  // Base data
  id: z.number(),
  name: z.string().min(5, {
    message: "El nombre debe contar con al menos 5 caracteres.",
  }),
  description: z.string().min(5, {
    message: "La descripción debe contar con al menos 5 caracteres.",
  }),
  quality: z.string(),
  code: z.string().min(1, {
    message: "El código no puede estar vacío.",
  }),
  disabled: z.boolean(),
  // Measure data
  measureType: z.string({ required_error: "Seleccione una unidad de medida" }),
  measures: z.string() || null,
  // Sale unit data
  saleUnit: z.string().min(1, {
    message: "La unidad de venta no puede estar vacía.",
  }),
  saleUnitPrice: z.string(),
  saleUnitCost: z.string(),
  measurePerSaleUnit: z.string() || null,
  // Discount data
  discountPercentage: z.array(z.number()).or(z.number()) || null,
  // External data
  providerId: z.string(),
  categoryId: z.string(),
  subcategoryId: z.string() || null,
  images: z.array(z.string()) || null,
  // Characteristics
  color: z.string() || null,
  origen: z.string() || null,
  borde: z.string() || null,
  aspecto: z.string() || null,
  textura: z.string() || null,
  transito: z.string() || null,
});

export const UpdateProduct = () => {
  const { id } = useParams();
  const {
    BASE_URL,
    fetchProduct,
    fetchSubcategoriesByCategoryId,
    Providers,
    Categories,
    // Re fetch the filter data when updating a product
    fetchCategories,
    fetchProviders,
    fetchMeasures,
    fetchPrices,
  } = useCatalogContext();
  const { getToken } = useKindeAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      name: "",
      description: "",
      quality: "",
      code: "",
      measureType: "",
      measures: "",
      saleUnit: "",
      saleUnitPrice: "",
      saleUnitCost: "",
      measurePerSaleUnit: "",
      discountPercentage: 0,
      providerId: "",
      categoryId: "",
      subcategoryId: "",
      images: [],
      color: "",
      origen: "",
      borde: "",
      aspecto: "",
      textura: "",
      transito: "",
    },
  });

  // Static form data setting
  const [Subcategories, setSubcategories] = useState<Array<Subcategory>>([]);

  // Dynamic form data setting
  useEffect(() => {
    const selectedCategoryId = form.watch("categoryId");
    if (selectedCategoryId) {
      fetchSubcategoriesByCategoryId(parseInt(selectedCategoryId)).then(
        (result) => setSubcategories(result ?? [])
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("categoryId")]);

  // Image uploading
  const [SelectedFiles, setSelectedFiles] = useState<Array<File>>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const uploadImages = async (files: Array<File>) => {
    const uploadPromises = files.map(async (file) => {
      try {
        if (!getToken) {
          console.error("Token is undefined");
          throw new Error("Authentication token is missing.");
        }
        const accessToken = await getToken();

        const responseUrl = await fetch(
          `${BASE_URL}/img?fileName=${file.name}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!responseUrl.ok) {
          throw new Error(
            `Failed to get Presigned URL: ${responseUrl.statusText}`
          );
        }

        const uploadUrl = await responseUrl.text();

        await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        return uploadUrl.split("?")[0];
      } catch (error) {
        console.error("Error during Image Upload: ", error);
        throw error;
      }
    });
    return Promise.all(uploadPromises);
  };

  // Form submitting
  const [IsSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const fileInput = SelectedFiles;
      if (fileInput && fileInput.length > 0) {
        const uploadedUrls = await uploadImages(fileInput);
        data.images = [...data.images, ...uploadedUrls];
      }
      if (data.discountPercentage && Array.isArray(data.discountPercentage)) {
        data.discountPercentage = Number(data.discountPercentage[0]);
      }
      await submitFormData(data);
    } catch (error) {
      console.error("Error during form submission: ", error);
    }
  };

  const submitFormData = async (
    formData: z.infer<typeof formSchema>
  ): Promise<void> => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/product`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        console.error("Error creando el producto: ", response.statusText);
        toast({
          variant: "destructive",
          title: `Error ${response.status}`,
          description: `Ocurrió un error al actualizar el producto.`,
        });
        return;
      }
      toast({
        title: "Producto actualizado",
        description: "El producto ha sido actualizado con éxito",
      });
      fetchCategories();
      fetchProviders();
      fetchMeasures();
      fetchPrices();
      navigate(-1);
    } catch (error) {
      console.error("Error creando el producto: ", error);
      toast({
        variant: "destructive",
        title: `Error ${error}`,
        description: `Ocurrió un error al actualizar el producto.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct(Number.parseInt(id)).then((result) => {
        if (!result) {
          navigate(-1);
        }
        form.reset({
          id: result?.id ?? 0,
          name: result?.name ?? "",
          description: result?.description ?? "",
          quality: result?.quality ?? "",
          code: result?.code ?? "",
          disabled: result?.disabled ?? false,
          measureType: result?.measureType ?? "",
          measures: result?.measures ?? "",
          saleUnit: result?.saleUnit ?? "",
          saleUnitPrice: result?.saleUnitPrice.toString() ?? "",
          saleUnitCost: result?.saleUnitCost.toString() ?? "",
          measurePerSaleUnit: result?.measurePerSaleUnit.toString() ?? "",
          discountPercentage: result?.discountPercentage ?? undefined,
          providerId: result?.providerId.toString() ?? "",
          categoryId: result?.categoryId.toString() ?? "",
          subcategoryId: result?.subcategoryId.toString() ?? "",
          images: result?.images ?? [],
          color:
            result?.characteristics?.find((e) => {
              return e.key === "Color";
            })?.value ?? "",
          origen:
            result?.characteristics?.find((e) => {
              return e.key === "Origen";
            })?.value ?? "",
          borde:
            result?.characteristics?.find((e) => {
              return e.key === "Borde";
            })?.value ?? "",
          aspecto:
            result?.characteristics?.find((e) => {
              return e.key === "Aspecto";
            })?.value ?? "",
          textura:
            result?.characteristics?.find((e) => {
              return e.key === "Textura";
            })?.value ?? "",
          transito:
            result?.characteristics?.find((e) => {
              return e.key === "Tránsito";
            })?.value ?? "",
        });
        fetchSubcategoriesByCategoryId(
          parseInt(result?.categoryId.toString() ?? "")
        ).then((result) => setSubcategories(result ?? []));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const removeImage = (url: string) => {
    toast({
      variant: "destructive",
      title: "Confirmación",
      description: "¿Eliminar la imagen?",
      action: (
        <ToastAction
          altText="Eliminar"
          onClick={() => {
            form.setValue(
              "images",
              form.watch("images").filter((image: string) => image !== url)
            );
          }}
        >
          Eliminar
        </ToastAction>
      ),
    });
  };

  return (
    <div>
      <h1 className="sectionTitle">Editar Producto</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={"w-full grid grid-cols-2 gap-4"}
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
          <div className="col-span-1 row-start-3 p-3 bg-primary-foreground rounded h-[100px] flex flex-row gap-4">
            <FormField
              control={form.control}
              name="quality"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Calidad (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 1ra" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 17629" {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Provider, Category and Subcategory data */}
          {form.watch("providerId") !== "" && (
            <FormField
              control={form.control}
              name="providerId"
              render={({ field }) => (
                <FormItem className="col-span-1 row-span-1 row-start-4 row-end-5">
                  <FormLabel>Proveedor</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={Providers?.Loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.isArray(Providers?.data) &&
                        (Providers?.data as Provider[]).map(
                          (provider: Provider, index: number) => {
                            return (
                              <SelectItem
                                value={provider.id.toString()}
                                key={index}
                              >
                                {provider.name}
                              </SelectItem>
                            );
                          }
                        )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {form.watch("categoryId") !== "" && (
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="col-span-1 row-span-1 row-start-5 row-end-6">
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={Categories?.Loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.isArray(Categories?.data) &&
                        (Categories?.data as Category[]).map(
                          (category: Category, index: number) => {
                            return (
                              <SelectItem
                                value={category.id.toString()}
                                key={index}
                              >
                                {category.name}
                              </SelectItem>
                            );
                          }
                        )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {form.watch("subcategoryId") !== "" &&
            Subcategories?.length !== 0 && (
              <FormField
                control={form.control}
                name="subcategoryId"
                render={({ field }) => (
                  <FormItem className="col-span-1 row-span-1 row-start-6 row-end-7">
                    <FormLabel>Subcategoría</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={Subcategories?.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Subcategories?.map(
                          (subcategory: Subcategory, index: number) => {
                            return (
                              <SelectItem
                                value={subcategory.id.toString()}
                                key={index}
                              >
                                {subcategory.name}
                              </SelectItem>
                            );
                          }
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          {/* Sale unit data */}
          <div className="saleUnitSection row-span-3 row-start-1 row-end-3 col-start-2 p-4 bg-primary-foreground rounded">
            <FormField
              control={form.control}
              name="saleUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad de venta</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
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
            <div className="flex justify-between align-center">
              <FormField
                control={form.control}
                name="saleUnitCost"
                render={({ field }) => (
                  <FormItem className="w-[49%]">
                    <FormLabel className="flex justify-start align-center pt-2">
                      Costo de compra
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 ml-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            El costo de compra al proveedor
                            <br />
                            Ejemplos: <br />
                            - $ 10000 por Caja <br />
                            - $ 5000 por Pieza <br />
                            - $ 1000 por Juego <br />
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 8000" {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="saleUnitPrice"
                render={({ field }) => (
                  <FormItem className="w-[49%]">
                    <FormLabel className="flex justify-start align-center pt-2">
                      Precio
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 ml-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            El precio de venta al cliente. <br />
                            Ejemplos: <br />
                            - $ 10000 por Caja <br />
                            - $ 5000 por Pieza <br />
                            - $ 1000 por Juego <br />
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: 10000.50"
                        {...field}
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Measures data */}
          <div className="measureSection row-span-3 row-start-3 row-end-6 col-start-2 p-4 bg-primary-foreground rounded flex flex-col justify-evenly">
            <FormField
              control={form.control}
              name="measureType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad de medida</FormLabel>
                  <Select
                    defaultValue="M2"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="M2" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="M2">M2</SelectItem>
                      <SelectItem value="ML">ML</SelectItem>
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
                <FormItem>
                  <FormLabel className="flex justify-start align-center pt-2">
                    Cantidad
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 ml-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Ejemplos: <br />
                          - M2 por Caja: 25 <br />
                          - Unidades por Juego: 5 <br />- Si se vende por
                          unidad: 1
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 2.35" {...field} type="number" />
                  </FormControl>
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
          </div>
          {/* Discount data */}
          {form.watch("discountPercentage") !== undefined && (
            <div className="col-start-2 row-start-6 row-end-7 px-4 py-2 bg-primary-foreground rounded">
              <FormField
                control={form.control}
                name="discountPercentage"
                render={({ field }) => (
                  <FormItem className="col-span-1 row-span-1 row-start-6 row-end-7">
                    <FormLabel>
                      Porcentaje de descuento (Opcional):
                      <span className="px-2 text-lg font-semibold">
                        %{field.value ? field.value : 0}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          {/* Images */}
          <div className="col-span-2 row-start-7 p-4 bg-primary-foreground rounded flex flex-col gap-4">
            <section className="loadImages">
              <Label htmlFor="file-input">Agregar Imágenes (Opcional)</Label>
              <Input
                type="file"
                multiple
                id="file-input"
                onChange={handleFileChange}
              />
            </section>
            {form.watch("images").length !== 0 && (
              <section className="removeImages">
                <Label>Eliminar Imágenes</Label>
                <div className="flex flex-row gap-2 flex-wrap">
                  {form.watch("images").map((image: string, index: number) => (
                    <article
                      key={index}
                      className="w-60 h-60 rounded-md border border-input bg-contain bg-no-repeat bg-center relative"
                      style={{ backgroundImage: `url(${image})` }}
                    >
                      <span
                        className="p-2 absolute right-1 bottom-1 bg-destructive rounded-md cursor-pointer hover:opacity-85"
                        onClick={() => removeImage(image)}
                      >
                        <Trash color="white" />
                      </span>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
          {/* Tags */}
          <div className="col-span-2 row-start-8 row-end-11 p-4 bg-primary-foreground rounded flex flex-col gap-4">
            <div className="characteristicsHeader flex flex-row justify-between w-full">
              <h3 className="text-xl font-semibold">
                Características (Opcional)
              </h3>
            </div>
            <div className="characteristicsContainer flex flex-col gap-2">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Rojo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="origen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origen</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: España" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="borde"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Borde</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Rectificado / Sin Rectificar"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aspecto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aspecto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Madera / Mármol" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="textura"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Textura</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Mate / Satinado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="transito"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tránsito</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Intenso / Solo pared"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Submit button */}
          <div className="buttonDiv col-span-2 w-full flex justify-center items-center row-start-11">
            <Button type="submit" className="w-1/3" disabled={IsSubmitting}>
              {IsSubmitting && <Loader2 className="animate-spin" />}
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
