import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs } from "@/components/ui/tabs";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import BasicDataTab from "@/Pages/Products/CreateProduct/BasicDataTab";
import SaleDataTab from "@/Pages/Products/CreateProduct/SaleDataTab";
import ExtraDataTab from "@/Pages/Products/CreateProduct/ExtraDataTab";
import { CreateProductDTO } from "@/hooks/CatalogInterfaces";
import { Progress } from "@/components/ui/progress";

const CreateProduct = ({ ProductProp }: { ProductProp?: CreateProductDTO }) => {
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

  const [DialogOpen, setDialogOpen] = useState(false);

  //#green Tabs management
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
  useEffect(() => {
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
  }, [currentTab]);
  //#

  //#orange Complete creation style utils
  const [LoadingRequest, setLoadingRequest] = useState(false);
  useEffect(() => {
    if (LoadingRequest) {
      setProgress(100);
    } else {
      setProgress(66);
    }
  }, [LoadingRequest]);
  //#

  //#blue Submit creation logic

  //#

  return (
    <Dialog open={DialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="text-lg w-[19.2%] max-w-[300px] min-w-[200px]">
          <CirclePlus />
          Crear Producto
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-label="modal"
        aria-describedby={undefined}
        className="lg:w-[70vw] xl:max-w-[1344px] h-[80vh] flex flex-col justify-start "
      >
        <div className="flex flex-row items-center">
          <DialogTitle className="text-3xl font-bold">
            Crear Producto
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
          />
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProduct;
