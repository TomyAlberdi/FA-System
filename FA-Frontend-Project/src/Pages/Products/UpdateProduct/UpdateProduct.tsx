import { CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductContext } from "@/Context/Product/UseProductContext";
import { CompleteProduct, CreateProductDTO } from "@/hooks/CatalogInterfaces";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BasicDataTab from "../CreateProduct/BasicDataTab";
import ExtraDataTab from "../CreateProduct/ExtraDataTab";
import SaleDataTab from "../CreateProduct/SaleDataTab";

const UpdateProduct = () => {
  const { id } = useParams();
  const { fetchProduct, updateProduct } = useProductContext();
  const navigate = useNavigate();

  const [LoadingRequest, setLoadingRequest] = useState(true);
  const [Product, setProduct] = useState<CompleteProduct | null>(null);

  const [UpdatedProduct, setUpdatedProduct] = useState<CreateProductDTO>({
    name: Product?.name ?? "",
    description: Product?.description ?? "",
    quality: Product?.quality ?? "",
    code: Product?.code ?? "",
    measureType: Product?.measureType ?? "M2",
    measures: Product?.measures ?? "",
    saleUnit: Product?.saleUnit ?? "Caja",
    saleUnitPrice: Product?.saleUnitPrice ?? 0,
    saleUnitCost: Product?.saleUnitCost ?? 0,
    profitMargin: Product?.profitMargin ?? 0,
    measureUnitCost: Product?.measureUnitCost ?? 0,
    measurePerSaleUnit: Product?.measurePerSaleUnit ?? 0,
    discountPercentage: Product?.discountPercentage ?? 0,
    providerId: Product?.providerId ?? 0,
    categoryId: Product?.categoryId ?? 0,
    subcategoryId: Product?.subcategoryId ?? 0,
    images: Product?.images ?? [],
    color: Product?.color ?? "",
    origen: Product?.origen ?? "",
    borde: Product?.borde ?? "",
    aspecto: Product?.aspecto ?? "",
    textura: Product?.textura ?? "",
    transito: Product?.transito ?? "",
  });

  useEffect(() => {
    if (id) {
      fetchProduct(Number.parseInt(id))
        .then((result) => {
          if (!result) {
            navigate(-1);
          }
          setProduct(result ?? null);
        })
        .finally(() => setLoadingRequest(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (Product) {
      const mappedProduct: CreateProductDTO = {
        ...Product,
        color:
          Product.characteristics.find((c) => c.key === "Color")?.value ?? "",
        origen:
          Product.characteristics.find((c) => c.key === "Origen")?.value ?? "",
        borde:
          Product.characteristics.find((c) => c.key === "Borde")?.value ?? "",
        aspecto:
          Product.characteristics.find((c) => c.key === "Aspecto")?.value ?? "",
        textura:
          Product.characteristics.find((c) => c.key === "Textura")?.value ?? "",
        transito:
          Product.characteristics.find((c) => c.key === "Transito")?.value ??
          "",
      };
      setUpdatedProduct(mappedProduct);
    }
  }, [Product]);

  const submitUpdateProduct = async (newProduct: CreateProductDTO) => {
    setLoadingRequest(true);
    await updateProduct(Product?.id ?? 0, newProduct).finally(() => {
      setLoadingRequest(false);
    });
  };

  return (
    <ScrollArea className="flex flex-col justify-start px-1/5 pb-2">
      <CardTitle className="md:text-3xl text-2xl font-bold">
        Editar Producto
      </CardTitle>
      {!Product ? (
        <>
          <Skeleton className="w-full h-1/3" />
          <Skeleton className="w-full h-1/3" />
          <Skeleton className="w-full h-1/3" />
        </>
      ) : (
        <>
          <BasicDataTab
            Product={UpdatedProduct}
            setProduct={setUpdatedProduct}
            loading={LoadingRequest}
          />
          <SaleDataTab
            Product={UpdatedProduct}
            setProduct={setUpdatedProduct}
            loading={LoadingRequest}
          />
          <ExtraDataTab
            Product={UpdatedProduct}
            setProduct={setUpdatedProduct}
            loading={LoadingRequest}
            setLoading={setLoadingRequest}
            createProduct={submitUpdateProduct}
          />
        </>
      )}
    </ScrollArea>
  );
};
export default UpdateProduct;
