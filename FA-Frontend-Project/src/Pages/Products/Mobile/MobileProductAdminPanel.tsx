import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useProductContext } from "@/Context/Product/UseProductContext";
import { CompleteProduct } from "@/hooks/CatalogInterfaces";
import { ProductDetail } from "@/lib/ProductDetail";
import CreateProduct from "@/Pages/Products/CreateProduct/CreateProduct";
import { CircleX, ListPlus, ListX, Menu, Package, Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface MobileProductAdminPanelProps {
  Product: CompleteProduct | null;
}

const MobileProductAdminPanel = ({ Product }: MobileProductAdminPanelProps) => {
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
    <Drawer>
      <DrawerTrigger asChild className="flex md:hidden">
        <Button className="w-full my-2">
          <Menu className="bigger-icon" />
          Administrar Producto
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm flex flex-col justify-center items-center py-4 gap-4">
          <CreateProduct
            ProductProp={Product}
            TriggerTitle="Editar Producto"
            TriggerIcon={Pencil}
          />
          <Button
            className="w-10/12 text-md"
            variant="destructive"
            onClick={onDeletePress}
          >
            <CircleX />
            Eliminar Producto
          </Button>
          {Product?.disabled ? (
            <Button
              className="w-10/12 text-md bg-chart-2"
              onClick={onEnablePress}
            >
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default MobileProductAdminPanel;
