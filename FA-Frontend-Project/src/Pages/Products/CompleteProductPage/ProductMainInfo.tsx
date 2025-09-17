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
    <Card className="p-2 flex flex-col justify-start items-start relative md:w-3/4 w-full h-full">
      <div className="categoryLinks flex-row justify-start items-center gap-2 font-semibold hidden md:flex">
        <Button variant={"ghost"}>
          <Link to={`/catalog/categories/${Product?.categoryId}`}>
            {Product?.category}
          </Link>
        </Button>
        <ChevronRight size={20} />
        <Button variant={"ghost"}>
          <Link to={`/catalog/subcategory/${Product?.subcategoryId}`}>
            {Product?.subcategory}
          </Link>
        </Button>
      </div>
      <div className="mobileCategory flex flex-row justify-start items-center gap-2 font-semibold md:hidden text-sm px-1 py-1">
        <span>{Product?.category}</span>
        <ChevronRight size={15} />
        <span>{Product?.subcategory}</span>
      </div>
      <CardTitle className="md:px-4 md:pt-2 md:pb-4 px-1 md:text-4xl text-2xl font-bold">
        {Product?.name}
      </CardTitle>
      <Button variant={"ghost"} className="hidden md:flex">
        <Link
          to={`/catalog/providers/${Product?.providerId}`}
          className="font-semibold"
        >
          {Product?.provider}
        </Link>
      </Button>
      <div className="mobileProvider">
        <span className="block md:hidden text-sm px-1 py-1">
          {Product?.provider}
        </span>
      </div>
      <p className="md:px-4 px-1">{Product?.description}</p>
      {Product?.code && (
        <span className="absolute right-0 top-2 md:px-4 px-2 py-1 bg-chart-1 rounded-l-md md:text-lg text-sm font-semibold text-white">
          {Product?.code}
        </span>
      )}
      {Product?.disabled && (
        <span className="absolute right-0 md:top-14 top-11 md:px-4 px-2 py-1 bg-destructive rounded-l-md md:text-lg text-sm font-semibold text-white">
          DESACTIVADO
        </span>
      )}
    </Card>
  );
};
