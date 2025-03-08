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
  // Calculate the sale price
  const [Rentabilidad, setRentabilidad] = useState(0);
  const getSalePrice = (profitability: number, saleUnitCost: number) => {
    const markup = profitability / 100;
    const salePrice = saleUnitCost * (1 + markup);
    return Math.round(salePrice * 100) / 100;
  };
  useEffect(() => {
    setProduct((prev) => ({
      ...prev,
      saleUnitPrice: getSalePrice(Rentabilidad, Product?.saleUnitCost),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Rentabilidad, Product?.saleUnitCost]);

  // Calculate the measure price
  const [MeasurePrice, setMeasurePrice] = useState(0);
  const getMeasurePrice = (
    measurePerSaleUnit: number,
    saleUnitPrice: number
  ) => {
    const measurePrice = saleUnitPrice / measurePerSaleUnit;
    return Math.round(measurePrice);
  };
  useEffect(() => {
    setMeasurePrice(
      getMeasurePrice(Product?.measurePerSaleUnit, Product?.saleUnitPrice)
    );
  }, [Product?.saleUnitPrice, Product?.measurePerSaleUnit]);

  return (
    <TabsContent value="saleData" className="h-full w-full">
      <div className="h-full w-full grid grid-cols-6 grid-rows-8 gap-4">
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
            value={Product?.saleUnitCost}
            type="number"
            min={0}
            onChange={(e) =>
              setProduct((prev) => ({
                ...prev,
                saleUnitCost: parseFloat(e.target.value),
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
            max={100}
            step={1}
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
            value={
              Product?.measureType === Product?.saleUnit
                ? 1
                : Product?.measurePerSaleUnit
            }
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
        <div className="row-start-3 row-span-5 col-start-1 col-span-6 rounded flex flex-col ">
          <h2 className="text-2xl font-semibold mb-4">Información de venta</h2>
          <div className="grid grid-cols-10 grid-rows-5 gap-2 h-full">
            <Card className="bg-primary-foreground row-start-1 col-start-1 col-span-2 row-span-2">
              <CardHeader>
                <CardTitle className="text-center">
                  Precio por {Product?.saleUnit}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <span className="text-2xl">$ {Product?.saleUnitPrice}</span>
              </CardContent>
            </Card>
            <Card className="bg-primary-foreground row-start-1 col-start-3 col-span-2 row-span-2">
              <CardHeader>
                <CardTitle className="text-center">
                  Precio por {Product?.measureType}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <span className="text-2xl">$ {MeasurePrice}</span>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="row-start-8 col-span-2 col-start-3 flex flex-row justify-between items-center gap-2">
          <Button onClick={onPrevious} className="gap-2 w-1/2">
            <ChevronLeft size={16} />
            Anterior
          </Button>
          <Button onClick={onNext} className="gap-2 w-1/2">
            Siguiente
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </TabsContent>
  );
};
export default SaleDataTab;
