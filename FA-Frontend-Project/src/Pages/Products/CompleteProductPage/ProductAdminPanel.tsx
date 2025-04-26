import { Button } from "@/components/ui/button";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { CompleteProduct } from "@/hooks/CatalogInterfaces";
import { ProductDetail } from "@/lib/ProductDetail";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { CircleX, ListPlus, ListX, Package, Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CreateProduct from "@/Pages/Products/CreateProduct/CreateProduct";

export const ProductPageAdminPanel = ({
  Product,
  ReloadProduct,
  setReloadProduct,
}: {
  Product: CompleteProduct | null;
  ReloadProduct: boolean;
  setReloadProduct: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
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
    } catch (error) {
      console.error("Error: ", error);
      window.alert("Ocurrió un error al actualizar el producto");
    } finally {
      setReloadProduct(!ReloadProduct);
    }
  };

  const onDeletePress = () => {
    if (window.confirm("¿Desea eliminar el producto?")) {
      deleteProduct();
    }
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
        window.alert(`Error eliminando el producto: ${response.status}`);
        return;
      }
      window.alert("Producto eliminado con éxito");
      fetchMeasures();
      fetchPrices();
      fetchCategories();
      fetchProviders();
      navigate(-1);
    } catch (error) {
      console.error("Error: ", error);
      window.alert("Ocurrió un error al eliminar el producto");
    }
  };

  return (
    <div className="h-full w-1/4 p-2 hidden md:flex flex-col justify-start items-center gap-4">
      <CreateProduct
        ProductProp={Product}
        TriggerTitle="Editar Producto"
        TriggerIcon={Pencil}
        ReloadProduct={ReloadProduct}
        setReloadProduct={setReloadProduct}
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
    </div>
  );
};
