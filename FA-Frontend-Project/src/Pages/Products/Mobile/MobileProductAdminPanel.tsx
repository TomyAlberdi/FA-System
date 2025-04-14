import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ToastAction } from "@/components/ui/toast";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { CompleteProduct } from "@/hooks/CatalogInterfaces";
import { toast } from "@/hooks/use-toast";
import { ProductDetail } from "@/lib/ProductDetail";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { CircleX, ListPlus, ListX, Menu, Package } from "lucide-react";
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
  const {
    BASE_URL,
    // Re fetch the filter data when deleting a product
    fetchCategories,
    fetchProviders,
    fetchMeasures,
    fetchPrices,
  } = useCatalogContext();
  const { getToken } = useKindeAuth();
  const navigate = useNavigate();

  const onDisablePress = () => {
    toast({
      variant: "destructive",
      title: "Confirmación",
      description: "¿Desea desactivar el producto?",
      action: (
        <ToastAction
          altText="Desactivar"
          onClick={() => updateProductStatus(true)}
        >
          Desactivar
        </ToastAction>
      ),
    });
  };

  const onEnablePress = () => {
    toast({
      variant: "default",
      title: "Confirmación",
      description: "¿Desea activar el producto?",
      action: (
        <ToastAction
          altText="Activar"
          onClick={() => updateProductStatus(false)}
        >
          Activar
        </ToastAction>
      ),
    });
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
        toast({
          variant: "destructive",
          title: `Error ${response.status}`,
          description: `Ocurrió un error al actualizar el producto.`,
        });
        return;
      }
      toast({
        title: "Producto actualizado",
        description: "El producto ha sido actualizado con éxito",
      });
    } catch (error) {
      console.error("Error: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al actualizar el producto",
      });
    } finally {
      setReloadProduct(!ReloadProduct);
    }
  };

  const onDeletePress = () => {
    toast({
      variant: "destructive",
      title: "Confirmación",
      description:
        "¿Desea eliminar el producto? Esta acción no se puede deshacer.",
      action: (
        <ToastAction altText="Eliminar" onClick={deleteProduct}>
          Eliminar
        </ToastAction>
      ),
    });
  };

  const deleteProduct = async () => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/product/${Product?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error: ", response.statusText);
        toast({
          variant: "destructive",
          title: `Error ${response.status}`,
          description: `Ocurrió un error al eliminar el producto.`,
        });
        return;
      }
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado con éxito",
      });
      fetchMeasures();
      fetchPrices();
      fetchCategories();
      fetchProviders();
      navigate(-1);
    } catch (error) {
      console.error("Error: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al eliminar el producto",
      });
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
