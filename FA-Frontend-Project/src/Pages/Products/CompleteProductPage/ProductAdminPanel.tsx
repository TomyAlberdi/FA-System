import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { CompleteProduct } from "@/hooks/CatalogInterfaces";
import { toast } from "@/hooks/use-toast";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import {
  CircleX,
  ListPlus,
  ListX,
  Package,
  Pencil,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";

export const ProductPageAdminPanel = ({
  Product,
  ReloadProduct,
  setReloadProduct
}: {
  Product: CompleteProduct | null;
  ReloadProduct: boolean;
  setReloadProduct: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

  const { BASE_URL } = useCatalogContext();
  const { getToken } = useKindeAuth();

  const onDisablePress = () => {
    toast({
      variant: "destructive",
      title: "Confirmación",
      description: "¿Desea desactivar el producto?",
      action: (
        <ToastAction altText="Desactivar" onClick={() => updateProductStatus(true)}>
          Desactivar
        </ToastAction>
      )
    })
  }

  const onEnablePress = () => {
    toast({
      variant: "default",
      title: "Confirmación",
      description: "¿Desea activar el producto?",
      action: (
        <ToastAction altText="Activar" onClick={() => updateProductStatus(false)}>
          Activar
        </ToastAction>
      )
    })
  }

  const updateProductStatus = async (disabled: boolean) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/product?productId=${Product?.id}&disabled=${disabled}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }
      });
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
  }

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
        <Button className="w-10/12 text-md bg-chart-2" onClick={onEnablePress}>
          <ListPlus />
          Activar Producto
        </Button>
      ) : (
        <Button className="w-10/12 text-md" variant="destructive" onClick={onDisablePress}>
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
      <Button className="w-10/12 text-md">
        <Download />
        Descargar Detalle
      </Button>
    </div>
  );
};
