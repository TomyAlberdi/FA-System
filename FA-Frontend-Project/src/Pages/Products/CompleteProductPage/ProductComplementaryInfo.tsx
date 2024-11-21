import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import {
  CompleteProduct,
  ProductStock,
  StockRecord,
} from "@/hooks/CatalogInterfaces";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const ProductComplementaryInfo = ({
  Product,
}: {
  Product: CompleteProduct | null;
}) => {
  const { fetchProductStock } = useCatalogContext();

  const [Stock, setStock] = useState<ProductStock | null>(null);

  useEffect(() => {
    if (Product) {
      fetchProductStock(Product.id).then((result) => setStock(result ?? null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Product]);

  const formatDateTime = (input: string) => {
    const parsedDate = new Date(input);
    if (isNaN(parsedDate.getTime())) {
      return "Error en formato de fecha";
    }
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const year = String(parsedDate.getFullYear()).slice(-2);
    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

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
        <AccordionItem value="stock">
          <AccordionTrigger>Stock</AccordionTrigger>
          <AccordionContent className="px-2 flex flex-col justify-start items-start gap-2">
            <h3 className="p-2">
              STOCK ACTUAL:
              <span className="ml-2 p-2 bg-destructive text-destructive-foreground rounded-md text-lg">
                {Stock?.quantity} {Product?.saleUnit}s{" "}
                {Product?.saleUnit !== Product?.measureType &&
                  Stock &&
                  Product &&
                  `(${Stock?.quantity * Product?.measurePerSaleUnit} ${
                    Product?.measureType
                  })`}
              </span>
            </h3>
            {Stock?.stockRecords && Stock?.stockRecords?.length > 0 && (
              <Table>
                <TableCaption>Últimos 5 registros</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/12">Tipo</TableHead>
                    <TableHead className="w-1/3">Cantidad</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Stock?.stockRecords &&
                    Stock?.stockRecords
                      .slice(0, 5)
                      .map((record: StockRecord, i: number) => {
                        return (
                          <TableRow key={i}>
                            <TableCell>
                              {record.recordType === "INCREASE" ? (
                                <ChevronUp color="#48a584" />
                              ) : (
                                <ChevronDown color="#f65a5a" />
                              )}
                            </TableCell>
                            <TableCell>{record.stockChange}</TableCell>
                            <TableCell>
                              {formatDateTime(record.recordDate)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            )}
            <Button asChild>
              <Link to={`/catalog/products/stock/${Product?.id}`}>
                Ver Registro Completo
              </Link>
            </Button>
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
