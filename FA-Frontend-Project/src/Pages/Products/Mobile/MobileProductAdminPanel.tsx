import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useCategoryContext } from "@/Context/Category/UseCategoryContext";
import { useProductContext } from "@/Context/Product/UseProductContext";
import { useProviderContext } from "@/Context/Provider/UseProviderContext";
import { CompleteProduct } from "@/hooks/CatalogInterfaces";
import { ProductDetail } from "@/lib/ProductDetail";
import CreateProduct from "@/Pages/Products/CreateProduct/CreateProduct";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { CircleX, ListPlus, ListX, Menu, Package, Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface MobileProductAdminPanelProps {
  Product: CompleteProduct | null;
  ReloadProduct: boolean;
  setReloadProduct: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileProductAdminPanel = ({
  Product,
  ReloadProduct,
  setReloadProduct,
}: MobileProductAdminPanelProps) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { fetchMeasures, fetchPrices } = useProductContext();
  const { fetchCategories } = useCategoryContext();
  const { fetchProviders } = useProviderContext();
  const { getToken } = useKindeAuth();
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
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(
        `${BASE_URL}/product?productId=${Product?.id}&disabled=${disabled}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        console.error("Error: ", response.statusText);
        window.alert(`Error actualizando el producto: ${response.status}`);
        return;
      }
      window.alert("Producto actualizado con éxito");
      setReloadProduct(!ReloadProduct);
    } catch (error) {
      console.error("Error: ", error);
      window.alert("Ocurrió un error al actualizar el producto");
    }
  };

  const onDeletePress = () => {
    if (window.confirm("¿Desea eliminar el producto?")) {
      deleteProduct();
    }
  };

  const deleteProduct = async () => {
    if (!getToken || !Product?.id) {
      console.error("Missing requirements for deletion");
      window.alert("Error: No se puede eliminar el producto");
      return;
    }
    try {
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/product/${Product.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error:", response.statusText);
        window.alert(`Error eliminando el producto: ${response.status}`);
        return;
      }
      window.alert("Producto eliminado con éxito");
      await Promise.all([
        fetchMeasures(),
        fetchPrices(),
        fetchCategories(),
        fetchProviders(),
      ]);
      navigate(-1);
    } catch (error) {
      console.error("Error:", error);
      window.alert("Ocurrió un error al eliminar el producto");
    }
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
