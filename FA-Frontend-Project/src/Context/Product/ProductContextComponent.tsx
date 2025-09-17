import {
  ProductContext,
  ProductContextType,
} from "@/Context/Product/ProductContext";
import {
  CompleteProduct,
  CreateProductDTO,
  Measure,
  Price,
  ReturnData,
} from "@/hooks/CatalogInterfaces";
// removed getToken-based auth
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProductContextComponentProps {
  children: ReactNode;
}

const ProductContextComponent: React.FC<ProductContextComponentProps> = ({
  children,
}) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const fetchProduct = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/product/${id}`);
      if (!response.ok) {
        console.error("Error fetching Product: ", response.statusText);
        window.alert(
          "Ocurrió un error al obtener el producto: " + response.status
        );
        return;
      }
      const result: CompleteProduct = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Product: ", error);
    }
  };

  const createProduct = async (dto: CreateProductDTO) => {
    try {
      const response = await fetch(`${BASE_URL}/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) {
        console.error("Error fetching Product: ", response.statusText);
        window.alert(
          "Ocurrió un error al crear el producto: " + response.status
        );
      }
      window.alert("Producto creado con éxito.");
      await fetchMeasures();
      await fetchPrices();
    } catch (error) {
      console.error("Error fetching Product: ", error);
    }
  };

  const [ProductUpdater, setProductUpdater] = useState(0);

  const updateProduct = async (id: number, dto: CreateProductDTO) => {
    try {
      const response = await fetch(`${BASE_URL}/product/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) {
        console.error("Error fetching Product: ", response.statusText);
        window.alert(
          "Ocurrió un error al actualizar el producto: " + response.status
        );
      }
      window.alert("Producto actualizado con éxito.");
      setProductUpdater((prev) => prev + 1);
      await fetchMeasures();
      await fetchPrices();
    } catch (error) {
      console.error("Error fetching Product: ", error);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/product/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        console.error("Error fetching Product: ", response.statusText);
        window.alert(
          "Ocurrió un error al eliminar el producto: " + response.status
        );
      }
      await fetchMeasures();
      await fetchPrices();
      navigate(-1);
    } catch (error) {
      console.error("Error fetching Product: ", error);
    }
  };

  const updateProductDisabledStatus = async (id: number, disabled: boolean) => {
    try {
      const response = await fetch(
        `${BASE_URL}/product/${id}?disabled=${disabled}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        console.error("Error: ", response.statusText);
        window.alert(`Error actualizando el producto: ${response.status}`);
        return;
      }
      setProductUpdater((prev) => prev + 1);
    } catch (error) {
      console.error("Error: ", error);
      window.alert("Ocurrió un error al actualizar el producto");
    }
  };

  const [Measures, setMeasures] = useState<ReturnData<Measure>>({
    Loading: true,
    data: Array<Measure>(),
  });

  const fetchMeasures = async () => {
    try {
      const response = await fetch(`${BASE_URL}/filter/measures`);
      if (!response.ok) {
        console.error("Error fetching Measures: ", response.statusText);
        return;
      }
      const result: Array<Measure> = await response.json();
      setMeasures({ Loading: false, data: result });
    } catch (error) {
      console.error("Error fetching Measures: ", error);
      setMeasures({ Loading: false, data: [] });
    }
  };

  const [Prices, setPrices] = useState<ReturnData<Price>>({
    Loading: true,
    data: Array<Price>(),
  });

  const fetchPrices = async () => {
    try {
      const response = await fetch(`${BASE_URL}/filter/prices`);
      if (!response.ok) {
        console.error("Error fetching Prices: ", response.statusText);
        return;
      }
      const result: Array<Price> = await response.json();
      setPrices({ Loading: false, data: result });
    } catch (error) {
      console.error("Error fetching Prices: ", error);
      setPrices({ Loading: false, data: [] });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      fetchMeasures();
      fetchPrices();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exportData: ProductContextType = {
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductDisabledStatus,
    Measures,
    fetchMeasures,
    Prices,
    fetchPrices,
    ProductUpdater,
  };

  return (
    <ProductContext.Provider value={exportData}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContextComponent;
