import { ProductsHeader } from "@/Pages/Products/ProductsHeader";
import { useState } from "react";

export const ProductPagination = () => {

  const [UpdateData, setUpdateData] = useState(false);

  return (
    <section className="ProductPagination col-span-6">
      <ProductsHeader setUpdateData={setUpdateData} UpdateData={UpdateData} />
    </section>
  );
};
