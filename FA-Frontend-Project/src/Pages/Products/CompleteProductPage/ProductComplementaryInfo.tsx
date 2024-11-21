import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CompleteProduct
} from "@/hooks/CatalogInterfaces";

export const ProductComplementaryInfo = ({
  Product,
}: {
  Product: CompleteProduct | null;
}) => {
  return (
    <ScrollArea className="complementaryInfo row-start-5 row-end-16 col-start-5 col-end-16 productGridItem px-2 py-4">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger>Precio</AccordionTrigger>
          <AccordionContent className="px-2 flex flex-col justify-start items-start text-lg gap-2">
            {Product?.discountPercentage && Product?.discountPercentage > 0 ? (
              <>
                <span className="p-2 bg-destructive text-destructive-foreground rounded-md">
                  EN OFERTA -{Product?.discountPercentage}% :
                </span>
                <span>
                  $ {Product?.discountedPrice} x {Product?.saleUnit}
                </span>
                {Product?.saleUnit !== Product?.measureType && (
                  <span>
                    $ {Product?.discountedMeasurePrice} x {Product?.measureType}
                  </span>
                )}
              </>
            ) : (
              <>
                <span>
                  $ {Product?.saleUnitPrice} x {Product?.saleUnit}
                </span>
                {Product?.saleUnit !== Product?.measureType && (
                  <span>
                    $ {Product?.measurePrice} x {Product?.measureType}
                  </span>
                )}
              </>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="characteristics">
          <AccordionTrigger>Características</AccordionTrigger>
          <AccordionContent>Info características</AccordionContent>
        </AccordionItem>
      </Accordion>
    </ScrollArea>
  );
};
