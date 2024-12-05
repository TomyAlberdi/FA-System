import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { Category, CompleteProduct, Provider, Subcategory } from "@/hooks/CatalogInterfaces";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
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

export const UpdateProduct = () => {
  const { id } = useParams();
  const {
    BASE_URL,
    fetchProduct,
    fetchProviders,
    fetchCategories,
    fetchSubcategoriesByCategoryId,
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
    const uploadPromises = files.map(async (file) => {
      try {
        if (!getToken) {
          console.error("Token is undefined");
          throw new Error("Authentication token is missing.")
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
          throw new Error(`Failed to get Presigned URL: ${responseUrl.statusText}`);
        }

        const uploadUrl = await responseUrl.text();

        await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type
          }
        })

        return uploadUrl.split("?")[0];
      } catch (error) {
        console.error("Error during Image Upload: ", error);
        throw error;
      }
    })
    return Promise.all(uploadPromises);
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
        value: form.watch("color"),
      },
      {
        key: "origen",
        value: form.watch("origen"),
      },
      {
        key: "borde",
        value: form.watch("borde"),
      },
      {
        key: "aspecto",
        value: form.watch("aspecto"),
      },
      {
        key: "textura",
        value: form.watch("textura"),
      },
      {
        key: "transito",
        value: form.watch("transito"),
      },
    ]
  );

  // Form submitting
  const [IsSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const fileInput = SelectedFiles;
      if (fileInput && fileInput.length > 0) {
        const uploadedUrls = await uploadImages(fileInput);
        data.images = uploadedUrls;
      }

      if (Characteristics[0].value) data.color = Characteristics[0].value;
      if (Characteristics[1].value) data.origen = Characteristics[1].value;
      if (Characteristics[2].value) data.borde = Characteristics[2].value;
      if (Characteristics[3].value) data.aspecto = Characteristics[3].value;
      if (Characteristics[4].value) data.textura = Characteristics[4].value;
      if (Characteristics[5].value) data.transito = Characteristics[5].value;

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
        method: "PATCH",
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
      navigate(-1)
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
      fetchProduct(Number.parseInt(id))
        .then((result) => {
          if (!result) {
            navigate(-1);
          }
          form.reset({
            id: result?.id ?? 0,
            name: result?.name ?? "",
            description: result?.description ?? "",
            quality: result?.quality ?? "",
            measureType: result?.measureType ?? "",
            measures: result?.measures ?? "",
            saleUnit: result?.saleUnit ?? "",
            saleUnitPrice: result?.saleUnitPrice.toString() ?? "",
            measurePerSaleUnit: result?.measurePerSaleUnit.toString() ?? "",
            discountPercentage: result?.discountPercentage ?? 0,
            providerId: result?.providerId.toString() ?? "",
            categoryId: result?.categoryId.toString() ?? "",
            subcategoryId: result?.subcategoryId.toString() ?? "",
            images: result?.images ?? [],
            color: result?.color ?? "",
            origen: result?.origen ?? "",
            borde: result?.borde ?? "",
            aspecto: result?.aspecto ?? "",
            textura: result?.textura ?? "",
            transito: result?.transito ?? "",
          })
          fetchSubcategoriesByCategoryId(parseInt(selectedCategoryId)).then(
            (result) => setSubcategories(result ?? [])
          );
          setSelectedSaleUnit(result?.saleUnit ?? "");
          setSelectedMeasureType(result?.measureType ?? "");
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (<div>
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
      </form>
    </Form>
  </div>);
};
