import { CardTitle } from "@/components/ui/card";
import { useProductContext } from "@/Context/Product/UseProductContext";
import { CreateProductDTO } from "@/hooks/CatalogInterfaces";
import BasicDataTab from "@/Pages/Products/CreateProduct/BasicDataTab";
import ExtraDataTab from "@/Pages/Products/CreateProduct/ExtraDataTab";
import SaleDataTab from "@/Pages/Products/CreateProduct/SaleDataTab";
import { useState } from "react";

const CreateProduct = () => {
  const { createProduct } = useProductContext();

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
    profitMargin: 0,
    measureUnitCost: 0,
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

  const [LoadingRequest, setLoadingRequest] = useState(false);

  const submitCreateProduct = async (newProduct: CreateProductDTO) => {
    setLoadingRequest(true);
    await createProduct(newProduct).finally(() => setLoadingRequest(false));
  };

  return (
    <section className="flex flex-col justify-start px-1/5 pb-2">
      <CardTitle className="md:text-3xl text-2xl font-bold">
        Crear Producto
      </CardTitle>
      <BasicDataTab
        Product={Product}
        setProduct={
          setProduct as React.Dispatch<React.SetStateAction<CreateProductDTO>>
        }
        loading={LoadingRequest}
      />
      <SaleDataTab
        Product={Product}
        setProduct={
          setProduct as React.Dispatch<React.SetStateAction<CreateProductDTO>>
        }
        loading={LoadingRequest}
      />
      <ExtraDataTab
        Product={Product}
        setProduct={
          setProduct as React.Dispatch<React.SetStateAction<CreateProductDTO>>
        }
        loading={LoadingRequest}
        setLoading={setLoadingRequest}
        createProduct={submitCreateProduct}
      />
    </section>
  );
};

export default CreateProduct;
