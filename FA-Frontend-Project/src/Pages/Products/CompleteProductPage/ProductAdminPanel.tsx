import { Button } from "@/components/ui/button";
import { CompleteProduct } from "@/hooks/CatalogInterfaces";
import {
  CircleX,
  ListPlus,
  ListX,
  Package,
  Pencil,
  Download,
} from "lucide-react";

export const ProductPageAdminPanel = ({
  Product,
}: {
  Product: CompleteProduct | null;
}) => {
  return (
    <div className="adminPanel productGridItem row-start-8 row-end-16 col-start-1 col-end-5 p-2 flex flex-col justify-start items-center gap-4">
      <Button className="w-10/12 text-md">
        <Pencil />
        Editar Producto
      </Button>
      <Button className="w-10/12 text-md" variant="destructive">
        <CircleX />
        Eliminar Producto
      </Button>
      {Product?.disabled ? (
        <Button className="w-10/12 text-md bg-chart-2">
          <ListPlus />
          Activar Producto
        </Button>
      ) : (
        <Button className="w-10/12 text-md" variant="destructive">
          <ListX />
          Desactivar Producto
        </Button>
      )}
      <Button className="w-10/12 text-md">
        <Package />
        Actualizar Stock
      </Button>
      <Button className="w-10/12 text-md">
        <Download />
        Imprimir Detalle
      </Button>
    </div>
  );
};
