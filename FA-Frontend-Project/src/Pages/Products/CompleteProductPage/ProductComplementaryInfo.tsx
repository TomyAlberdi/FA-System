import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { characteristic, CompleteProduct } from "@/hooks/CatalogInterfaces";
import { useEffect, useState } from "react";

export const ProductComplementaryInfo = ({
  Product,
}: {
  Product: CompleteProduct | null;
}) => {
  const getRentabilidad = (saleUnitCost: number, saleUnitPrice: number) => {
    const profitMargin = ((saleUnitPrice - saleUnitCost) / saleUnitCost) * 100;
    return Math.round(profitMargin * 100) / 100;
  };

  const [Rentabilidad, setRentabilidad] = useState(0);
  useEffect(() => {
    if (Product?.saleUnitCost && Product?.saleUnitPrice) {
      if (Product?.discountPercentage > 0) {
        setRentabilidad(
          getRentabilidad(Product?.saleUnitCost, Product?.discountedPrice)
        );
      } else {
        setRentabilidad(
          getRentabilidad(Product?.saleUnitCost, Product?.saleUnitPrice)
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    Product?.saleUnitCost,
    Product?.saleUnitPrice,
    Product?.discountPercentage,
  ]);

  return (
    <div className="md:h-full md:w-3/4 md:px-2 md:py-4 h-auto w-full px-0 py-0">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="measures">
          <AccordionTrigger>Información</AccordionTrigger>
          <AccordionContent className="flex md:flex-row flex-col items-center gap-2 md:flex-wrap w-full">
            {Product?.discountPercentage && Product?.discountPercentage > 0 ? (
              <Card className="bg-destructive md:w-auto w-full">
                <CardHeader>
                  <CardTitle className="text-center">Oferta</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <span className="text-2xl font-bold">
                    - {Product?.discountPercentage}%
                  </span>
                </CardContent>
              </Card>
            ) : null}
            {Product?.saleUnitPrice && Product?.saleUnit && (
              <Card
                className={
                  Product?.discountPercentage && Product?.discountPercentage > 0
                    ? "bg-destructive md:w-auto w-full"
                    : "md:w-auto w-full"
                }
              >
                <CardHeader>
                  <CardTitle className="text-center">
                    Precio por {Product?.saleUnit}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  {Product?.discountPercentage &&
                  Product?.discountPercentage > 0 ? (
                    <span className="text-xl">
                      $ {Product?.discountedPrice}
                    </span>
                  ) : (
                    <span className="text-xl">$ {Product?.saleUnitPrice}</span>
                  )}
                </CardContent>
              </Card>
            )}
            {Product?.measurePrice !== Product?.saleUnitPrice && (
              <Card
                className={
                  Product?.discountPercentage && Product?.discountPercentage > 0
                    ? "bg-destructive md:w-auto w-full"
                    : "md:w-auto w-full"
                }
              >
                <CardHeader>
                  <CardTitle className="text-center">
                    Precio por {Product?.measureType}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  {Product?.discountPercentage &&
                  Product?.discountPercentage > 0 ? (
                    <span className="text-xl">
                      $ {Product?.discountedMeasurePrice}
                    </span>
                  ) : (
                    <span className="text-xl">$ {Product?.measurePrice}</span>
                  )}
                </CardContent>
              </Card>
            )}
            {Product?.measurePerSaleUnit &&
              Product?.measureType !== Product?.saleUnit && (
                <Card className="md:w-auto w-full">
                  <CardHeader>
                    <CardTitle className="text-center">
                      {Product?.measureType} por {Product?.saleUnit}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <span className="text-xl">
                      {Product?.measurePerSaleUnit} {Product?.measureType}
                    </span>
                  </CardContent>
                </Card>
              )}
            {Product?.measures && (
              <Card className="md:w-auto w-full">
                <CardHeader>
                  <CardTitle className="text-center">Medidas</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <span className="text-xl">{Product?.measures}</span>
                </CardContent>
              </Card>
            )}
            {Product?.quality && (
              <Card className="md:w-auto w-full">
                <CardHeader>
                  <CardTitle className="text-center">Calidad</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <span className="text-xl">{Product?.quality}</span>
                </CardContent>
              </Card>
            )}
          </AccordionContent>
        </AccordionItem>
        {Product?.characteristics && Product?.characteristics.length > 0 && (
          <AccordionItem value="tags">
            <AccordionTrigger>Características</AccordionTrigger>
            <AccordionContent className="flex md:flex-row flex-col items-center gap-2 md:flex-wrap w-full">
              {Product?.characteristics?.map(
                (tag: characteristic, index: number) => {
                  return (
                    tag.value !== null &&
                    tag.value !== "" && (
                      <Card key={index} className="md:w-auto w-full">
                        <CardHeader>
                          <CardTitle className="text-center">
                            {tag.key}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                          <span className="text-xl">{tag.value}</span>
                        </CardContent>
                      </Card>
                    )
                  );
                }
              )}
            </AccordionContent>
          </AccordionItem>
        )}
        {Product?.saleUnitCost && Product?.saleUnitCost > 0 ? (
          <AccordionItem value="saleUnitCost">
            <AccordionTrigger>Costo</AccordionTrigger>
            <AccordionContent className="flex md:flex-row flex-col items-center gap-2 md:flex-wrap w-full">
              <Card className="md:w-auto w-full">
                <CardHeader>
                  <CardTitle className="text-center">
                    Costo por {Product?.saleUnit}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <span className="text-xl">
                    $ {Product?.saleUnitCost} por {Product?.saleUnit}
                  </span>
                </CardContent>
              </Card>
              {Product?.saleUnit !== Product?.measureType && (
                <Card className="md:w-auto w-full">
                  <CardHeader>
                    <CardTitle className="text-center">
                      Costo por {Product?.measureType}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <span className="text-xl">
                      $ {Product?.measureUnitCost} por {Product?.measureType}
                    </span>
                  </CardContent>
                </Card>
              )}
              <Card
                className={
                  Rentabilidad < 0
                    ? "bg-destructive md:w-auto w-full"
                    : "md:w-auto w-full"
                }
              >
                <CardHeader>
                  <CardTitle className="text-center">Rentabilidad</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <span className="text-xl">% {Rentabilidad}</span>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ) : null}
      </Accordion>
    </div>
  );
};
