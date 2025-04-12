import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs } from "@/components/ui/tabs";
import { LucideProps } from "lucide-react";
import { FC, useEffect, useState } from "react";
import BasicDataTab from "@/Pages/Products/CreateProduct/BasicDataTab";
import SaleDataTab from "@/Pages/Products/CreateProduct/SaleDataTab";
import ExtraDataTab from "@/Pages/Products/CreateProduct/ExtraDataTab";
import { CompleteProduct, CreateProductDTO } from "@/hooks/CatalogInterfaces";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useToast } from "@/hooks/use-toast";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const CreateProduct = ({
  ProductProp,
  TriggerTitle,
  TriggerIcon,
  ReloadProduct,
  setReloadProduct,
}: {
  ProductProp?: CompleteProduct | null;
  TriggerTitle: string;
  TriggerIcon: FC<LucideProps>;
  ReloadProduct?: boolean | null;
  setReloadProduct?: React.Dispatch<React.SetStateAction<boolean>> | null;
}) => {
  const navigate = useNavigate();
  const { getToken } = useKindeAuth();
  const { toast } = useToast();
  const {
    BASE_URL,
    fetchProviders,
    fetchCategories,
    fetchMeasures,
    fetchPrices,
  } = useCatalogContext();

  const [Product, setProduct] = useState<CreateProductDTO>({
    // Tab 1
    name: ProductProp?.name ?? "",
    description: ProductProp?.description ?? "",
    quality: ProductProp?.quality ?? "",
    code: ProductProp?.code ?? "",
    providerId: ProductProp?.providerId ?? 0,
    categoryId: ProductProp?.categoryId ?? 0,
    subcategoryId: ProductProp?.subcategoryId ?? 0,
    // Tab 2
    measureType: ProductProp?.measureType ?? "M2",
    measures: ProductProp?.measures ?? "",
    saleUnit: ProductProp?.saleUnit ?? "Caja",
    saleUnitPrice: ProductProp?.saleUnitPrice ?? 0,
    saleUnitCost: ProductProp?.saleUnitCost ?? 0,
    measurePerSaleUnit: ProductProp?.measurePerSaleUnit ?? 0,
    discountPercentage: ProductProp?.discountPercentage ?? 0,
    // Tab 3
    images: ProductProp?.images ?? [],
    color: ProductProp?.color ?? "",
    origen: ProductProp?.origen ?? "",
    borde: ProductProp?.borde ?? "",
    aspecto: ProductProp?.aspecto ?? "",
    textura: ProductProp?.textura ?? "",
    transito: ProductProp?.transito ?? "",
  });

  useEffect(() => {
    if (ProductProp) {
      const mappedProduct = {
        ...ProductProp,
        color:
          ProductProp.characteristics.find((c) => c.key === "Color")?.value ??
          "",
        origen:
          ProductProp.characteristics.find((c) => c.key === "Origen")?.value ??
          "",
        borde:
          ProductProp.characteristics.find((c) => c.key === "Borde")?.value ??
          "",
        aspecto:
          ProductProp.characteristics.find((c) => c.key === "Aspecto")?.value ??
          "",
        textura:
          ProductProp.characteristics.find((c) => c.key === "Textura")?.value ??
          "",
        transito:
          ProductProp.characteristics.find((c) => c.key === "Transito")
            ?.value ?? "",
      };
      setProduct(mappedProduct);
    }
  }, [ProductProp]);

  const [DialogOpen, setDialogOpen] = useState(false);

  //#green Tabs & Loading Request state management
  const [currentTab, setCurrentTab] = useState("basicData");
  const handleNextTab = () => {
    switch (currentTab) {
      case "basicData":
        setCurrentTab("saleData");
        break;
      case "saleData":
        setCurrentTab("extraData");
        break;
    }
  };
  const handlePreviousTab = () => {
    switch (currentTab) {
      case "saleData":
        setCurrentTab("basicData");
        break;
      case "extraData":
        setCurrentTab("saleData");
        break;
    }
  };
  const [progress, setProgress] = useState(33);
  const [LoadingRequest, setLoadingRequest] = useState(false);
  useEffect(() => {
    if (LoadingRequest) {
      setProgress(100);
    } else {
      switch (currentTab) {
        case "basicData":
          setProgress(0);
          break;
        case "saleData":
          setProgress(33);
          break;
        case "extraData":
          setProgress(66);
          break;
      }
    }
  }, [currentTab, LoadingRequest]);
  //#

  //#blue Submit creation logic
  const createProduct = async (newProduct: CreateProductDTO) => {
    setLoadingRequest(true);
    try {
      if (!getToken) {
        console.error("Token is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) {
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
      fetchCategories();
      fetchProviders();
      fetchMeasures();
      fetchPrices();
      const responseData = await response.json();
      navigate(`/catalog/products/${responseData.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error ${error}`,
        description: `Ocurrió un error al crear el producto.`,
      });
    } finally {
      setLoadingRequest(false);
      setDialogOpen(false);
    }
  };

  const updateProduct = async (newProduct: CreateProductDTO) => {
    setLoadingRequest(true);
    try {
      if (!getToken) {
        console.error("Token is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/product`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) {
        toast({
          variant: "destructive",
          title: `Error ${response.status}`,
          description: `Ocurrió un error al actualizar el producto.`,
        });
        return;
      }
      toast({
        title: "Producto actualizado",
        description: "El producto ha sido actualizado con éxito.",
      });
      fetchCategories();
      fetchProviders();
      fetchMeasures();
      fetchPrices();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error ${error}`,
        description: "Ocurrió un error al actualizar el producto.",
      });
    } finally {
      setLoadingRequest(false);
      setDialogOpen(false);
      if (ReloadProduct !== null && setReloadProduct) {
        setReloadProduct(!ReloadProduct);
      }
    }
  };
  //#

  return (
    <Dialog open={DialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className={
            TriggerTitle == "Nuevo Producto"
              ? "text-lg w-[19.2%] max-w-[300px] min-w-[200px]"
              : TriggerTitle == "Añadir Producto"
              ? "h-full text-lg w-1/3"
              : "w-10/12 text-md"
          }
        >
          {TriggerTitle !== "Añadir Producto" ? <TriggerIcon /> : null}
          {TriggerTitle}
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-label="modal"
        aria-describedby={undefined}
        className="lg:w-[70vw] xl:max-w-[1344px]"
      >
        <ScrollArea className="w-full max-h-[80vh] overflow-auto flex flex-col justify-start px-6 pt-6 pb-2">
          <div className="flex flex-row items-center">
            <DialogTitle className="text-3xl font-bold">
              {TriggerTitle === "Nuevo Producto" ||
              TriggerTitle === "Añadir Producto"
                ? "Crear Producto"
                : "Actualizar Producto"}
            </DialogTitle>
            <Progress value={progress} max={100} className="w-[50%] ml-[3%]" />
          </div>
          <Tabs
            className="w-full h-full"
            value={currentTab}
            onValueChange={setCurrentTab}
          >
            <BasicDataTab
              onNext={handleNextTab}
              Product={Product}
              setProduct={setProduct}
            />
            <SaleDataTab
              onPrevious={handlePreviousTab}
              onNext={handleNextTab}
              Product={Product}
              setProduct={setProduct}
            />
            <ExtraDataTab
              onPrevious={handlePreviousTab}
              Product={Product}
              setProduct={setProduct}
              loading={LoadingRequest}
              setLoading={setLoadingRequest}
              createProduct={
                TriggerTitle === "Nuevo Producto" ||
                TriggerTitle === "Añadir Producto"
                  ? createProduct
                  : updateProduct
              }
              triggerTitle={TriggerTitle}
            />
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProduct;
