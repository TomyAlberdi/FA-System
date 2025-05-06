import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CreateProductDTO } from "@/hooks/CatalogInterfaces";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useEffect, useState } from "react";

interface SaleDataTabProps {
  onPrevious: () => void;
  onNext: () => void;
  Product: CreateProductDTO;
  setProduct: React.Dispatch<React.SetStateAction<CreateProductDTO>>;
}

const SaleDataTab = ({
  onPrevious,
  onNext,
  Product,
  setProduct,
}: SaleDataTabProps) => {
  //#indigo Calculate profit margin if product has sale unit price and sale unit cost
  const [Rentabilidad, setRentabilidad] = useState(0);
  useEffect(() => {
    if (Product?.saleUnitPrice && Product?.saleUnitCost) {
      const profitMargin =
        ((Product?.saleUnitPrice - Product?.saleUnitCost) /
          Product?.saleUnitCost) *
        100;
      setRentabilidad(Math.round(profitMargin * 100) / 100);
    } else {
      setRentabilidad(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#

  //#green Calculate and set prices if product has measure unit cost and profit margin
  const [MeasurePrice, setMeasurePrice] = useState(0);
  const getSalePrice = (profitability: number) => {
    if (profitability === 0) {
      const measureUnitPrice = Math.round(Product?.measureUnitCost * 100) / 100;
      setMeasurePrice(measureUnitPrice);
      if (Product?.saleUnit === Product?.measureType) {
        return measureUnitPrice;
      } else {
        return (
          Math.round(measureUnitPrice * Product?.measurePerSaleUnit * 100) / 100
        );
      }
    }
    const markup = 1 + profitability / 100;
    const measureUnitPrice =
      Math.round(Product?.measureUnitCost * markup * 100) / 100;
    setMeasurePrice(measureUnitPrice);
    if (Product?.saleUnit === Product?.measureType) {
      return measureUnitPrice;
    } else {
      const saleUnitCost = measureUnitPrice * Product?.measurePerSaleUnit;
      return Math.round(saleUnitCost * 100) / 100;
    }
  };
  useEffect(() => {
    setProduct((prev) => ({
      ...prev,
      saleUnitPrice: getSalePrice(Rentabilidad),
      saleUnitCost:
        Product?.measureType === Product?.saleUnit
          ? Product?.measureUnitCost
          : Product?.measureUnitCost * Product?.measurePerSaleUnit,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    Rentabilidad,
    Product?.measureUnitCost,
    Product?.measurePerSaleUnit,
    Product?.saleUnit,
    Product?.measureType,
  ]);
  //#

  //#orange set product measurePerSaleUnit to 1 if product saleUnit and measureType are equals
  useEffect(() => {
    if (Product?.saleUnit === Product?.measureType) {
      setProduct((prev) => ({
        ...prev,
        measurePerSaleUnit: 1,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Product?.saleUnit, Product?.measureType]);
  //#

  //#blue disable next button if product lacks required data
  const [DisableNext, setDisableNext] = useState(true);
  useEffect(() => {
    if (
      Product?.saleUnit &&
      Product?.saleUnitCost &&
      Product?.saleUnitPrice &&
      Product?.measurePerSaleUnit &&
      Product?.measureType
    ) {
      setDisableNext(false);
    } else {
      setDisableNext(true);
    }
  }, [
    Product?.saleUnit,
    Product?.saleUnitCost,
    Product?.saleUnitPrice,
    Product?.measurePerSaleUnit,
    Product?.measureType,
  ]);
  //#

  return (
    <TabsContent value="saleData" className="h-full w-full">
      <div className="h-full w-full md:grid grid-cols-6 grid-rows-6 gap-4 flex flex-col">
        <div className="row-start-1 col-start-1 col-span-2">
          <Label className="text-md">Unidad de venta</Label>
          <Select
            value={Product?.saleUnit}
            onValueChange={(value) =>
              setProduct((prev) => ({ ...prev, saleUnit: value }))
            }
          >
            <SelectTrigger>
              <SelectValue defaultValue={Product?.saleUnit} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Caja">Caja</SelectItem>
              <SelectItem value="Unidad">Unidad</SelectItem>
              <SelectItem value="Juego">Juego</SelectItem>
              <SelectItem value="Bolsa">Bolsa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="row-start-1 col-start-3 col-span-2">
          <Label className="flex items-center text-md">
            Costo de compra
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 ml-2" />
                </TooltipTrigger>
                <TooltipContent>
                  El costo al que se adquirió el producto del proveedor.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input
            value={Product?.measureUnitCost}
            type="number"
            min={0}
            onChange={(e) =>
              setProduct((prev) => ({
                ...prev,
                measureUnitCost: parseFloat(e.target.value),
              }))
            }
          />
        </div>
        <div className="row-start-1 col-start-5 col-span-2">
          <Label className="flex items-center text-md">
            Rentabilidad: {Rentabilidad} %
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 ml-2" />
                </TooltipTrigger>
                <TooltipContent>
                  El porcentaje de beneficio que se obtiene sobre el costo de
                  compra.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Slider
            className="my-4"
            min={0}
            max={200}
            step={0.1}
            value={[Rentabilidad]}
            onValueChange={(value) => setRentabilidad(value[0])}
          />
        </div>
        <div className="row-start-2 col-start-1 col-span-2">
          <Label className="text-md">Unidad de medida</Label>
          <Select
            value={Product?.measureType}
            onValueChange={(value) =>
              setProduct((prev) => ({ ...prev, measureType: value }))
            }
          >
            <SelectTrigger>
              <SelectValue defaultValue={Product?.measureType} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M2">M2</SelectItem>
              <SelectItem value="ML">ML</SelectItem>
              <SelectItem value="Unidad">Unidad</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="row-start-2 col-start-3 col-span-2">
          <Label className="text-md">
            {Product?.measureType === Product?.saleUnit
              ? "Cantidad"
              : `Cantidad de ${Product?.measureType} por ${Product?.saleUnit}`}
          </Label>
          <Input
            type="number"
            min={0}
            value={Product?.measurePerSaleUnit}
            placeholder="Ej: 2.35"
            disabled={Product?.measureType === Product?.saleUnit}
            onChange={(e) =>
              setProduct((prev) => ({
                ...prev,
                measurePerSaleUnit: parseFloat(e.target.value),
              }))
            }
          />
        </div>
        <div className="row-start-2 col-start-5 col-span-2">
          <Label className="text-md">Medidas o Peso (Opcional)</Label>
          <Input
            value={Product?.measures}
            placeholder="Ej: 20x20 / 10kg"
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, measures: e.target.value }))
            }
          />
        </div>
        <div className="row-start-3 row-span-1 col-start-1 col-span-6 flex flex-col justify-center md:items-center items-start">
          <Label className="md:text-lg text-md">
            Descuento por {Product?.saleUnit}: % {Product?.discountPercentage}{" "}
            (Opcional)
          </Label>
          <Slider
            className="md:w-1/3 w-full my-4"
            min={0}
            max={100}
            step={1}
            value={[Product?.discountPercentage]}
            onValueChange={(value) =>
              setProduct((prev) => ({ ...prev, discountPercentage: value[0] }))
            }
          />
        </div>
        <div className="row-start-4 row-span-2 col-span-6 rounded flex flex-col justify-start items-center">
          <h2 className="md:text-2xl text-xl font-semibold mb-4 text-center">
            Información de venta
          </h2>
          <div className="flex md:flex-row flex-col gap-4 md:w-auto w-full">
            <Card className="bg-primary-foreground">
              <CardHeader>
                <CardTitle className="text-center">
                  Precio por {Product?.saleUnit}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center flex flex-row gap-2 justify-center items-center">
                <span
                  className={
                    Product?.discountPercentage == 0 ||
                    Number.isNaN(Product?.saleUnitPrice)
                      ? "text-3xl"
                      : "text-xl line-through tetx-muted-foreground"
                  }
                >
                  ${" "}
                  {!Number.isNaN(Product?.saleUnitPrice)
                    ? Product?.saleUnitPrice
                    : 0}
                </span>
                {Product?.discountPercentage > 0 &&
                  Product?.saleUnitPrice > 0 && (
                    <span className="text-3xl text-destructive overflow-hidden">
                      $
                      {Math.round(
                        (1 - Product?.discountPercentage / 100.0) *
                          Product?.saleUnitPrice
                      )}
                    </span>
                  )}
              </CardContent>
            </Card>
            {Product?.saleUnit !== Product?.measureType && (
              <Card className="bg-primary-foreground">
                <CardHeader>
                  <CardTitle className="text-center">
                    Precio por {Product?.measureType}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center flex flex-row gap-2 justify-center items-center">
                  <span
                    className={
                      Product?.discountPercentage == 0 ||
                      Number.isNaN(Product?.saleUnitPrice)
                        ? "text-3xl"
                        : "text-xl line-through tetx-muted-foreground"
                    }
                  >
                    $
                    {Product?.saleUnit &&
                    Product?.measurePerSaleUnit &&
                    !Number.isNaN(MeasurePrice)
                      ? MeasurePrice
                      : 0}
                  </span>
                  {Product?.discountPercentage > 0 && MeasurePrice > 0 && (
                    <span className="text-3xl text-destructive overflow-hidden">
                      $
                      {Math.round(
                        (1 - Product?.discountPercentage / 100.0) * MeasurePrice
                      )}
                    </span>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        <div className="row-start-6 col-span-2 col-start-3 flex flex-row justify-between items-center gap-2">
          <Button onClick={onPrevious} className="gap-2 w-1/2">
            <ChevronLeft size={16} />
            Anterior
          </Button>
          <Button
            onClick={onNext}
            className="gap-2 w-1/2"
            disabled={DisableNext}
          >
            Siguiente
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </TabsContent>
  );
};
export default SaleDataTab;
