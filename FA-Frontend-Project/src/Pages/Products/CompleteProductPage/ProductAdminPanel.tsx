import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useProductContext } from "@/Context/Product/UseProductContext";
import { CompleteProduct } from "@/hooks/CatalogInterfaces";
import { ProductDetail } from "@/lib/ProductDetail";
import AddProductToBudget from "@/Pages/Budgets/AddProductToBudget";
import {
  CircleX,
  ListPlus,
  ListX,
  Package,
  Pencil,
  ShoppingCart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const ProductPageAdminPanel = ({
  Product,
}: {
  Product: CompleteProduct | null;
}) => {
  const { updateProductDisabledStatus, deleteProduct } = useProductContext();
  const navigate = useNavigate();

  const onDisablePress = () => {
    if (window.confirm("¿Desea desactivar el producto?")) {
      updateProductStatus(true);
    }
  };

  const onEnablePress = () => {
    if (window.confirm("¿Desea activar el producto?")) {
      updateProductStatus(false);
    }
  };

  const updateProductStatus = async (disabled: boolean) => {
    await updateProductDisabledStatus(Product?.id ?? 0, disabled);
  };

  const onDeletePress = () => {
    if (window.confirm("¿Desea eliminar el producto?")) {
      submitDeleteProduct();
    }
  };

  const submitDeleteProduct = async () => {
    await deleteProduct(Product?.id ?? 0).then(() => navigate(-1));
  };

  return (
    <div className="h-full w-1/4 p-2 hidden md:flex flex-col justify-start items-center gap-4">
      <Button asChild className="w-10/12">
        <Link to={`/catalog/products/update/${Product?.id}`}>
          <Pencil />
          Editar Producto
        </Link>
      </Button>
      <Button
        className="w-10/12 text-md"
        variant="destructive"
        onClick={onDeletePress}
      >
        <CircleX />
        Eliminar Producto
      </Button>
      {Product?.disabled ? (
        <Button className="w-10/12 text-md bg-chart-2" onClick={onEnablePress}>
          <ListPlus />
          Activar Producto
        </Button>
      ) : (
        <Button
          className="w-10/12 text-md"
          variant="destructive"
          onClick={onDisablePress}
        >
          <ListX />
          Desactivar Producto
        </Button>
      )}
      <Button className="w-10/12 text-md" asChild>
        <Link to={`/catalog/stock/${Product?.id}`}>
          <Package />
          Administrar Stock
        </Link>
      </Button>
      <ProductDetail Product={Product} />
      {Product && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-10/12 text-md">
              <ShoppingCart />
              Añadir al carrito
            </Button>
          </DialogTrigger>
          <AddProductToBudget product={Product} />
        </Dialog>
      )}
    </div>
  );
};
