import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BasicFilterProps as DiscountFilterProps } from "@/hooks/CatalogInterfaces";
import { useState } from "react";

export const DiscountFilter: React.FC<DiscountFilterProps> = ({
  Filter,
  setFilter,
}) => {
  const [Discount, setDiscount] = useState<boolean>(false);

  const handleCheckboxChange = (value: boolean) => {

    const newAppliedFilters = Filter?.filter(
      (filter) => filter?.type !== "discount"
    );

    if (value) {
      newAppliedFilters?.push({
        type: "discount",
        value: true,
      });
    }
    setDiscount(value);
    setFilter(newAppliedFilters);
  }

  return (
    <AccordionItem
      value="discountFilter"
      className="filterGroup w-full px-4 rounded-md"
    >
      <AccordionTrigger>Productos en oferta</AccordionTrigger>
      <AccordionContent className="w-full">
        <div
          className="flex items_center w-full cursor-pointer px-1 py-2"
          onClick={() => handleCheckboxChange(!Discount)}
        >
          <Label className="w-full cursor-pointer">Descuento</Label>
          <Checkbox
            checked={Discount}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
