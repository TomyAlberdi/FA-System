import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import BasicDataTab from "@/Pages/Products/CreateProduct/BasicDataTab";
import SaleDataTab from "@/Pages/Products/CreateProduct/SaleDataTab";
import ExtraDataTab from "@/Pages/Products/CreateProduct/ExtraDataTab";
import { CreateProductDTO } from "@/hooks/CatalogInterfaces";

const CreateProduct = () => {
  const [Product, setProduct] = useState<CreateProductDTO>({
    name: "",
    description: "",
    quality: "",
    code: "",
    measureType: "M2",
    measures: "",
    saleUnit: "Caja",
    saleUnitPrice: 0,
    saleUnitCost: 0,
    measurePerSaleUnit: 0,
    discountPercentage: 0,
    providerId: 0,
    categoryId: 0,
    subcategoryId: 0,
    images: [],
    color: "",
    origen: "",
    borde: "",
    aspecto: "",
    textura: "",
    transito: "",
  });

  const [DialogOpen, setDialogOpen] = useState(false);

  // Tabs management
  const [currentTab, setCurrentTab] = useState("basicData");
  const tabs = ["basicData", "saleData", "extraData"];

  const handleNextTab = () => {
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };

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
        <DialogTitle className="text-2xl font-bold">Crear Producto</DialogTitle>
        <Tabs
          className="w-full h-full"
          value={currentTab}
          onValueChange={setCurrentTab}
        >
          <TabsList className="grid w-full grid-cols-3 mb-5">
            <TabsTrigger value="basicData">Datos Básicos</TabsTrigger>
            <TabsTrigger value="saleData">Datos de Venta</TabsTrigger>
            <TabsTrigger value="extraData">Datos Adicionales</TabsTrigger>
          </TabsList>
          <BasicDataTab
            onNext={handleNextTab}
            Product={Product}
            setProduct={setProduct}
          />
          <SaleDataTab onNext={handleNextTab} />
          <ExtraDataTab onNext={handleNextTab} />
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProduct;
