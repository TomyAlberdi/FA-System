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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import {
  Category,
  characteristic,
  Provider,
  Subcategory,
} from "@/hooks/CatalogInterfaces";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Info, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  measureType: z.string({ required_error: "Seleccione una unidad de medida" }),
  measures: z.string() || null,
  // Sale unit data
  saleUnit: z.string().min(1, {
    message: "La unidad de venta no puede estar vacía.",
  }),
  saleUnitPrice: z.string(),
  measurePerSaleUnit: z.string() || null,
  // Discount data
  discountPercentage: z.number().max(100).min(0) || null,
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

export const AddProduct = () => {
  const {
    BASE_URL,
    fetchProviders,
    fetchCategories,
    fetchSubcategoriesByCategoryId,
  } = useCatalogContext();

  const { getToken } = useKindeAuth();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      quality: "",
      measureType: "",
      measures: "",
      saleUnit: "",
      saleUnitPrice: "",
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
  const [Providers, setProviders] = useState<Array<Provider>>([]);
  const [Categories, setCategories] = useState<Array<Category>>([]);
  const [Subcategories, setSubcategories] = useState<Array<Subcategory>>([]);
  useEffect(() => {
    fetchProviders().then((result) => setProviders(result ?? []));
    fetchCategories().then((result) => setCategories(result ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dynamic form data setting
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  useEffect(() => {
    if (selectedCategoryId) {
      fetchSubcategoriesByCategoryId(parseInt(selectedCategoryId)).then(
        (result) => setSubcategories(result ?? [])
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId]);

  const [SelectedSaleUnit, setSelectedSaleUnit] = useState("Caja");
  const [SelectedMeasureType, setSelectedMeasureType] = useState("M2");

  // Image uploading
  const [SelectedFiles, setSelectedFiles] = useState<Array<File>>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const uploadImages = async (files: Array<File>) => {
    const uploadedUrls: string[] = [];
    files.forEach(async (file) => {
      try {
        if (!getToken) {
          console.error("getToken is undefined");
          return false;
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
          console.error("Error: ", responseUrl.statusText);
          return false;
        }
        const uploadUrl = await responseUrl.text();
        await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });
        const imageUrl = uploadUrl.split("?")[0];
        uploadedUrls.push(imageUrl);
      } catch (error) {
        console.error("Error: ", error);
        return false;
      }
    });
    return uploadedUrls;
  };

  // Characteristics
  const characteristicsKey = [
    "Color",
    "Origen",
    "Borde",
    "Aspecto",
    "Textura",
    "Tránsito",
  ];

  const [Characteristics, setCharacteristics] = useState<Array<characteristic>>(
    [
      {
        key: "color",
        value: null,
      },
      {
        key: "origen",
        value: null,
      },
      {
        key: "borde",
        value: null,
      },
      {
        key: "aspecto",
        value: null,
      },
      {
        key: "textura",
        value: null,
      },
      {
        key: "transito",
        value: null,
      },
    ]
  );

  // Form submitting
  const [IsSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const fileInput = SelectedFiles;
      let imageUrls: string[] = [];
      if (fileInput && fileInput.length > 0) {
        imageUrls = await uploadImages(fileInput);
        data.images = imageUrls;
      }
      if (
        Characteristics[0].value !== null &&
        Characteristics[0].value !== ""
      ) {
        data.color = Characteristics[0].value;
      }
      if (
        Characteristics[1].value !== null &&
        Characteristics[1].value !== ""
      ) {
        data.origen = Characteristics[1].value;
      }
      if (
        Characteristics[2].value !== null &&
        Characteristics[2].value !== ""
      ) {
        data.borde = Characteristics[2].value;
      }
      if (
        Characteristics[3].value !== null &&
        Characteristics[3].value !== ""
      ) {
        data.aspecto = Characteristics[3].value;
      }
      if (
        Characteristics[4].value !== null &&
        Characteristics[4].value !== ""
      ) {
        data.textura = Characteristics[4].value;
      }
      if (
        Characteristics[5].value !== null &&
        Characteristics[5].value !== ""
      ) {
        data.transito = Characteristics[5].value;
      }
      await submitFormData(data);
    } catch (error) {
      console.error("Error: ", error);
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
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
        title: `Error ${error}`,
        description: `Ocurrió un error al crear el producto.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="AddProduct">
      <h1 className="sectionTitle">Añadir Producto</h1>
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Providers?.map((provider: Provider, index: number) => {
                      return (
                        <SelectItem value={provider.id.toString()} key={index}>
                          {provider.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="col-span-1 row-span-1 row-start-5 row-end-6">
                <FormLabel>Categoría</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    setSelectedCategoryId(value);
                    field.onChange(value);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Categories?.map((category: Category, index: number) => {
                      return (
                        <SelectItem value={category.id.toString()} key={index}>
                          {category.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
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
          {/* Sale unit data */}
          <div className="saleUnitSection row-span-3 row-start-1 row-end-3 col-start-2 p-4 bg-primary-foreground rounded">
            <FormField
              control={form.control}
              name="saleUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad de venta</FormLabel>
                  <Select
                    value={field.value}
                    defaultValue="Caja"
                    onValueChange={(value) => {
                      setSelectedSaleUnit(value);
                      field.onChange(value);
                    }}
                  >
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
              name="saleUnitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-start align-center pt-2">
                    Precio por {SelectedSaleUnit}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 ml-2" />
                        </TooltipTrigger>
                        <TooltipContent>
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
          {/* Measures data */}
          <div className="measureSection row-span-3 row-start-3 row-end-6 col-start-2 p-4 bg-primary-foreground rounded">
            <FormField
              control={form.control}
              name="measureType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad de medida del producto</FormLabel>
                  <Select
                    defaultValue="M2"
                    value={field.value}
                    onValueChange={(value) => {
                      setSelectedMeasureType(value);
                      field.onChange(value);
                    }}
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
                    Cantidad de {SelectedMeasureType} por {SelectedSaleUnit}
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
                    <Input
                      placeholder="Ej: 100"
                      {...field}
                      disabled={SelectedMeasureType === SelectedSaleUnit}
                      value={SelectedMeasureType === SelectedSaleUnit ? 1 : field.value}
                      type="number"
                    />
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
          <div className="col-start-2 row-start-6 row-end-7 p-4 bg-primary-foreground rounded">
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
                      defaultValue={[0]}
                      onValueChange={(values) => field.onChange(values[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Images */}
          <div className="col-span-2 row-start-7 row-end-9 p-4 bg-primary-foreground rounded h-[100px]">
            <Label htmlFor="file-input">Imágenes</Label>
            <Input
              type="file"
              multiple
              id="file-input"
              onChange={handleFileChange}
            />
          </div>
          {/* Tags */}
          <div className="col-span-2 row-start-9 row-end-11 p-4 bg-primary-foreground rounded flex flex-col gap-4">
            <div className="characteristicsHeader flex flex-row justify-between w-full">
              <h3 className="text-xl font-semibold">Agregar Características</h3>
            </div>
            <div className="characteristicsContainer flex flex-col gap-2">
              {
                // Add new characteristics
                characteristicsKey.map((c, index) => (
                  <div
                    className="flex flex-row justify-between w-full"
                    key={index}
                  >
                    <span className="text-lg font-semibold w-1/6 border border-input bg-secondary rounded-l-md flex justify-center items-center -mr-5">
                      {c}
                    </span>
                    <Input
                      onChange={(e) =>
                        setCharacteristics((prevState) => {
                          const newState = [...prevState];
                          newState[index].value = e.target.value;
                          return newState;
                        })
                      }
                      className="text-lg"
                    />
                  </div>
                ))
              }
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
