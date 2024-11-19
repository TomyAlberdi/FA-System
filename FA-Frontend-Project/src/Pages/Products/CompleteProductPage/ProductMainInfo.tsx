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
    <Card className="p-2 flex flex-col justify-start items-start row-start-1 row-end-5 col-start-5 col-end-16 productGridItem">
      <div className="categoryLinks flex flex-row justify-start items-center gap-2 font-semibold">
        <Button variant={"ghost"}>
          <Link to={`/catalog/categories/${Product?.categoryId}`}>
            {Product?.category}
          </Link>
        </Button>
        <ChevronRight size={20} />
        <Button variant={"ghost"}>
          <Link
            to={`/catalog/categories/subcategory/${Product?.subcategoryId}`}
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
      <p className="px-4">
        {Product?.description}
      </p>
    </Card>
  );
};
