import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBudgetContext } from "@/Context/Budget/UseBudgetContext";
import { CardProduct, CompleteProduct } from "@/hooks/CatalogInterfaces";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";

interface AddProductToBudgetProps {
  product: CardProduct | CompleteProduct;
}

const AddProductToBudget = ({ product }: AddProductToBudgetProps) => {
  const { CurrentBudget, updateCurrentBudget } = useBudgetContext();
  const [Discount, setDiscount] = useState<number>(0);
  const [Subtotal, setSubtotal] = useState(0);
  const [data, setData] = useState<{
    product: CardProduct | undefined;
    saleUnitQuantity: number | null;
    measureUnitQuantity: number;
  }>({
    product: undefined,
    saleUnitQuantity: null,
    measureUnitQuantity: 0,
  });

  useEffect(() => {
    if (product.discountPercentage > 0) {
      setDiscount(Discount + product.discountPercentage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addProductToBudget = () => {
    if (data.saleUnitQuantity === 0 || data.saleUnitQuantity === null) {
      window.alert("La cantidad de unidades no puede ser 0.");
      return;
    }
    const measureUnitQuantity =
      Math.round(
        (data.saleUnitQuantity * product.measurePerSaleUnit + Number.EPSILON) *
          100
      ) / 100;
    const newProduct = {
      id: product.id,
      productName: product.name,
      productMeasurePrice: product.measurePrice,
      measureUnitQuantity: measureUnitQuantity,
      saleUnitQuantity: data.saleUnitQuantity,
      discountPercentage: Discount,
      subtotal: Subtotal,
      productSaleUnit: product.saleUnit,
      productMeasureUnit: product.measureType,
      saleUnitPrice: product.saleUnitPrice,
    };
    const newProducts = Array.isArray(CurrentBudget?.products)
      ? [...CurrentBudget.products, newProduct]
      : [newProduct];
    updateCurrentBudget({
      ...CurrentBudget,
      products: newProducts,
    });
  };

  useEffect(() => {
    if (data.saleUnitQuantity === null) {
      setSubtotal(0);
      return;
    }
    const subtotal =
      Math.round(
        (data.saleUnitQuantity * product.saleUnitPrice + Number.EPSILON) * 100
      ) / 100;
    if (Discount === 0) {
      setSubtotal(subtotal);
      return;
    }
    const discountedSubtotal =
      Math.round((subtotal * (1 - Discount / 100) + Number.EPSILON) * 100) /
      100;
    setSubtotal(discountedSubtotal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.saleUnitQuantity, Discount]);

  return (
    <DialogContent
      className="w-[90%] md:w-full md:p-6 p-3 rounded-lg"
      aria-describedby={undefined}
    >
      <DialogTitle className="text-xl font-bold">
        Añadir {product.name}
      </DialogTitle>
      <div>
        <div>
          <Label className="text-lg">
            Cantidad de unidades ({product.saleUnit})
          </Label>
          <Input
            type="number"
            min={0}
            value={data.saleUnitQuantity ?? ""}
            onChange={(e) =>
              setData({
                ...data,
                saleUnitQuantity: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="mt-2">
          <Label className="text-md">
            Equivale a:
            <span className="text-xl font-semibold px-2">
              {Math.round(
                ((data.saleUnitQuantity ?? 0) * product.measurePerSaleUnit +
                  Number.EPSILON) *
                  100
              ) / 100}{" "}
              {product.measureType}
            </span>
          </Label>
        </div>
        <div className="mt-2">
          <Label className="text-lg">Descuento individual: %{Discount}</Label>
          <Input
            className="my-4"
            min={0}
            max={100}
            step={1}
            defaultValue={product.discountPercentage}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
        </div>
        <div className="my-3">
          <Label className="text-lg">
            Subtotal:
            <span className="text-xl font-semibold px-2">$ {Subtotal}</span>
          </Label>
        </div>
        <Button type="submit" className="w-full" onClick={addProductToBudget}>
          <CirclePlus />
          Agregar al carrito
        </Button>
      </div>
    </DialogContent>
  );
};
export default AddProductToBudget;
