import { CompleteProduct } from "@/hooks/CatalogInterfaces";

export const ProductComplementaryInfo = ({
  Product,
}: {
  Product: CompleteProduct | null;
}) => {
  return (
    <div className="complementaryInfo row-start-7 row-end-16 col-start-5 col-end-16 productGridItem">
      complementary info
    </div>
  );
};
