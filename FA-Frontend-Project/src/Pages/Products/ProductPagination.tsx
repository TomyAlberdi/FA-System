import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";

export const ProductPagination = () => {

  return (
    <section className="ProductPagination col-span-6">
      <section className="listHeader">
        <span></span>
        <Link to={"/catalog/products/add"}>
          <Button className="text-lg">
            <CirclePlus />
            Nuevo Producto
          </Button>
        </Link>
      </section>
    </section>
  );
};
