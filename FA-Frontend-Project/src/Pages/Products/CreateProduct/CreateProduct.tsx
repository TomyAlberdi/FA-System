import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs } from "@/components/ui/tabs";
import { useProductContext } from "@/Context/Product/UseProductContext";
import { CompleteProduct, CreateProductDTO } from "@/hooks/CatalogInterfaces";
import BasicDataTab from "@/Pages/Products/CreateProduct/BasicDataTab";
import ExtraDataTab from "@/Pages/Products/CreateProduct/ExtraDataTab";
import SaleDataTab from "@/Pages/Products/CreateProduct/SaleDataTab";
import { LucideProps } from "lucide-react";
import { FC, useEffect, useState } from "react";

const CreateProduct = ({
  ProductProp,
  TriggerTitle,
  TriggerIcon,
}: {
  ProductProp?: CompleteProduct | null;
  TriggerTitle: string;
  TriggerIcon: FC<LucideProps>;
}) => {
  const { createProduct, updateProduct } = useProductContext();

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
    measureUnitCost: ProductProp?.measureUnitCost ?? 0,
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
    if (LoadingRequest) return;
    setTimeout(() => {
      switch (currentTab) {
        case "basicData":
          setCurrentTab("saleData");
          break;
        case "saleData":
          setCurrentTab("extraData");
          break;
      }
    }, 100);
  };
  const handlePreviousTab = () => {
    if (LoadingRequest) return;
    setTimeout(() => {
      switch (currentTab) {
        case "saleData":
          setCurrentTab("basicData");
          break;
        case "extraData":
          setCurrentTab("saleData");
          break;
      }
    }, 100);
  };
  const [progress, setProgress] = useState(33);
  const [LoadingRequest, setLoadingRequest] = useState(false);
  useEffect(() => {
    if (LoadingRequest) {
      setProgress(100);
      return;
    }
    const timer = setTimeout(() => {
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
    }, 100);
    return () => clearTimeout(timer);
  }, [currentTab, LoadingRequest]);
  //#

  //#blue Submit creation logic
  const submitCreateProduct = async (newProduct: CreateProductDTO) => {
    setLoadingRequest(true);
    await createProduct(newProduct).finally(() => setLoadingRequest(false));
  };

  const submitUpdateProduct = async (newProduct: CreateProductDTO) => {
    setLoadingRequest(true);
    await updateProduct(ProductProp?.id ?? 0, newProduct).finally(() =>
      setLoadingRequest(false)
    );
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
              : TriggerTitle == ""
              ? ""
              : "w-10/12 text-md"
          }
        >
          {TriggerTitle !== "Añadir Producto" ? (
            <TriggerIcon className={TriggerTitle == "" ? "large-icon" : ""} />
          ) : null}
          {TriggerTitle}
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-label="modal"
        aria-describedby={undefined}
        className="lg:w-[70vw] xl:max-w-[1344px] w-[95vw] rounded-lg"
      >
        <ScrollArea className="w-full max-h-[80vh] overflow-auto flex flex-col justify-start md:px-6 px-3 md:pt-6 pt-3 pb-2">
          <div className="flex md:flex-row flex-col items-center">
            <DialogTitle className="md:text-3xl text-2xl font-bold">
              {TriggerTitle === "Nuevo Producto" ||
              TriggerTitle === "Añadir Producto" ||
              TriggerTitle == ""
                ? "Crear Producto"
                : "Actualizar Producto"}
            </DialogTitle>
            <Progress
              value={progress}
              max={100}
              className="md:w-[50%] w-full md:ml-[3%] ml-0 md:my-0 my-2"
            />
          </div>
          <Tabs
            className="w-full md:h-full h-auto"
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
                TriggerTitle === "Añadir Producto" ||
                TriggerTitle == ""
                  ? submitCreateProduct
                  : submitUpdateProduct
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
