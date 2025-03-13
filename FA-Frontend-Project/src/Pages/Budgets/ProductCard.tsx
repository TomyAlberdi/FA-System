import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CardProduct } from "@/hooks/CatalogInterfaces";
import { useToast } from "@/hooks/use-toast";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";

export const ProductCard = ({
  product,
  handleAddProduct,
}: {
  product: CardProduct;
  handleAddProduct: (
    product: CardProduct,
    measureUnitQuantity: number,
    saleUnitQuantity: number,
    discountPercentage: number,
    subtotal: number
  ) => void;
}) => {
  const [Open, setOpen] = useState(false);
  const { toast } = useToast();

  const [Discount, setDiscount] = useState<Array<number>>([0]);
  const [Subtotal, setSubtotal] = useState(0);
  const [data, setData] = useState({
    product: undefined,
    saleUnitQuantity: 0,
    measureUnitQuantity: 0,
  });

  useEffect(() => {
    const subtotal =
      Math.round(
        (data.saleUnitQuantity * product.saleUnitPrice + Number.EPSILON) * 100
      ) / 100;
    if (Discount[0] === 0) {
      setSubtotal(subtotal);
      return;
    }
    // Calculate discounted subtotal with 2 decimals
    const discountedSubtotal =
      Math.round((subtotal * (1 - Discount[0] / 100) + Number.EPSILON) * 100) /
      100;
    setSubtotal(discountedSubtotal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.saleUnitQuantity, Discount]);

  const addProductToBudget = () => {
    if (data.saleUnitQuantity === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La cantidad de unidades no puede ser 0.",
      });
      return;
    }
    const measureUnitQuantity =
      Math.round(
        (data.saleUnitQuantity * product.measurePerSaleUnit + Number.EPSILON) *
          100
      ) / 100;
    handleAddProduct(
      product,
      measureUnitQuantity,
      data.saleUnitQuantity,
      Discount[0],
      Subtotal
    );
    setOpen(false);
  };

  return (
    <Card className="w-[19.2%] h-[350px] p-2 grid grid-cols-1 grid-rows-8">
      <CardTitle className="row-span-1 truncate overflow-hidden whitespace-nowrap">
        {product.name}
      </CardTitle>
      <div
        className="row-span-5"
        style={
          product.image === "" || product.image === null
            ? {
                backgroundImage: `url(https://media.istockphoto.com/id/1147544807/es/vector/no-imagen-en-miniatura-gr%C3%A1fico-vectorial.jpg?s=612x612&w=0&k=20&c=Bb7KlSXJXh3oSDlyFjIaCiB9llfXsgS7mHFZs6qUgVk=)`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : {
                backgroundImage: `url(${product.image})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
        }
      />
      <div className="row-span-1" />
      <div className="row-span-1">
        <Dialog open={Open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full h-full">
              <CirclePlus />
              Añadir
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[500px] w-full"
            aria-describedby={undefined}
          >
            <DialogTitle className="text-xl font-bold">
              Añadir {product.name} al presupuesto
            </DialogTitle>
            <div>
              <div>
                <Label className="text-lg">
                  Cantidad de unidades ({product.saleUnit})
                </Label>
                <Input
                  type="number"
                  value={data.saleUnitQuantity}
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
                      (data.saleUnitQuantity * product.measurePerSaleUnit +
                        Number.EPSILON) *
                        100
                    ) / 100}{" "}
                    {product.measureType}
                  </span>
                </Label>
              </div>
              <div className="mt-2">
                <Label className="text-lg">
                  Descuento individual: %{Discount[0]}
                </Label>
                <Slider
                  className="my-4"
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setDiscount(value)}
                />
              </div>
              <div className="my-3">
                <Label className="text-lg">
                  Subtotal:
                  <span className="text-xl font-semibold px-2">
                    $ {Subtotal}
                  </span>
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full"
                onClick={addProductToBudget}
              >
                <CirclePlus />
                Agregar al presupuesto
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};
