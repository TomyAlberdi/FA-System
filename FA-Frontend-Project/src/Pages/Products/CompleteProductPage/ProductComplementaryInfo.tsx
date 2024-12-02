import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { characteristic, CompleteProduct } from "@/hooks/CatalogInterfaces";

export const ProductComplementaryInfo = ({
  Product,
}: {
  Product: CompleteProduct | null;
}) => {
  return (
    <div className="complementaryInfo row-start-5 row-end-16 col-start-5 col-end-16 productGridItem px-2 py-4">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["measures", "tags"]}
      >
        <AccordionItem value="measures">
          <AccordionTrigger>Información</AccordionTrigger>
          <AccordionContent className="flex flex-row items-center gap-2 flex-wrap">
            {Product?.discountPercentage && Product?.discountPercentage > 0 ? (
              <Card className="bg-destructive">
                <CardHeader>
                  <CardTitle className="text-center">Oferta</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <span className="text-2xl font-bold">
                    - {Product?.discountPercentage}%
                  </span>
                </CardContent>
              </Card>
            ): null}
            {Product?.saleUnitPrice && Product?.saleUnit && (
              <Card
                className={
                  Product?.discountPercentage && Product?.discountPercentage > 0
                    ? "bg-destructive"
                    : ""
                }
              >
                <CardHeader>
                  <CardTitle className="text-center">Precio por {Product?.saleUnit}</CardTitle>
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
                    ? "bg-destructive"
                    : ""
                }
              >
                <CardHeader>
                  <CardTitle className="text-center">Precio por {Product?.measureType}</CardTitle>
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
                <Card>
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Medidas</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <span className="text-xl">{Product?.measures} CM</span>
                </CardContent>
              </Card>
            )}
            {Product?.quality && (
              <Card>
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
            <AccordionContent className="flex flex-row items-center gap-2 flex-wrap">
              {Product?.characteristics?.map((tag: characteristic, index: number) => {
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-center">
                        {tag.key}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <span className="text-xl">{tag.value}</span>
                    </CardContent>
                  </Card>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};
