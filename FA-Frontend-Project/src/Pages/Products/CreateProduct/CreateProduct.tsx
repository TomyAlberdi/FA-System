import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  const [LoadingRequest, setLoadingRequest] = useState(false);

  const submitCreateProduct = async (newProduct: CreateProductDTO) => {
    setLoadingRequest(true);
    await createProduct(newProduct).finally(() => setLoadingRequest(false));
  };

  const submitUpdateProduct = async (newProduct: CreateProductDTO) => {
    if (!ProductProp?.id) return;
    setLoadingRequest(true);
    await updateProduct(ProductProp?.id ?? 0, newProduct).finally(() =>
      setLoadingRequest(false)
    );
  };

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
        className="rounded-lg max-w-[90vw]"
      >
        <ScrollArea className="w-full max-h-[90vh] overflow-auto flex flex-col justify-start md:px-6 px-3 md:pt-6 pt-3 pb-2">
          <div className="flex md:flex-row flex-col items-center">
            <DialogTitle className="md:text-3xl text-2xl font-bold">
              {TriggerTitle === "Nuevo Producto" ||
              TriggerTitle === "Añadir Producto" ||
              TriggerTitle == ""
                ? "Crear Producto"
                : "Actualizar Producto"}
            </DialogTitle>
          </div>
          <BasicDataTab
            Product={Product}
            setProduct={setProduct}
            loading={LoadingRequest}
          />
          <SaleDataTab
            Product={Product}
            setProduct={setProduct}
            loading={LoadingRequest}
          />
          <ExtraDataTab
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProduct;
