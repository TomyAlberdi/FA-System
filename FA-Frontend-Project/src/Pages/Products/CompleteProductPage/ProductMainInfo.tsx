import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { CompleteProduct } from "@/hooks/CatalogInterfaces";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export const ProductMainInfo = ({
  Product,
}: {
  Product: CompleteProduct | null;
}) => {
  return (
    <Card className="p-2 flex flex-col justify-start items-start row-start-1 row-end-5 col-start-5 col-end-16 productGridItem relative">
      <div className="categoryLinks flex flex-row justify-start items-center gap-2 font-semibold">
        <Button variant={"ghost"}>
          <Link to={`/catalog/categories/${Product?.categoryId}`}>
            {Product?.category}
          </Link>
        </Button>
        <ChevronRight size={20} />
        <Button variant={"ghost"}>
          <Link
            to={`/catalog/subcategory/${Product?.subcategoryId}`}
          >
            {Product?.subcategory}
          </Link>
        </Button>
      </div>
      <CardTitle className="px-4 pt-2 pb-4 text-6xl font-bold">
        {Product?.name}
      </CardTitle>
      <Button variant={"ghost"}>
        <Link
          to={`/catalog/providers/${Product?.providerId}`}
          className="font-semibold"
        >
          {Product?.provider}
        </Link>
      </Button>
      <p className="px-4">{Product?.description}</p>
      <span className="absolute right-0 top-2 px-4 py-1 bg-chart-1 rounded-l-md text-lg font-semibold text-white">
        {Product?.code}
      </span>
      {Product?.disabled && (
        <span className="absolute right-0 top-14 px-4 py-1 bg-destructive rounded-l-md text-lg font-semibold text-white">
          DESACTIVADO
        </span>
      )}
    </Card>
  );
};
