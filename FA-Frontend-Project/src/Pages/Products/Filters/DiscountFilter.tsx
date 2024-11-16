import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BasicFilterProps as DiscountFilterProps } from "@/hooks/CatalogInterfaces";
import { useEffect, useState } from "react";

export const DiscountFilter: React.FC<DiscountFilterProps> = ({
  Filter,
  setFilter,
}) => {
  const [Discount, setDiscount] = useState<boolean>(false);
  const [Discontinued, setDiscontinued] = useState<boolean>(false);

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
  };

  const handleDiscontinuedCheckboxChange = (value: boolean) => {
    const newAppliedFilters = Filter?.filter(
      (filter) => filter?.type !== "discontinued"
    );

    if (value) {
      newAppliedFilters?.push({
        type: "discontinued",
        value: true,
      });
    }
    setDiscontinued(value);
    setFilter(newAppliedFilters);
  };

  useEffect(() => {
    if (Filter && Filter.length === 0) {
      setDiscount(false);
    }
  }, [Filter]);

  return (
    <AccordionItem
      value="discountFilter"
      className="filterGroup w-full px-4 rounded-md"
    >
      <AccordionTrigger>Otros filtros</AccordionTrigger>
      <AccordionContent className="w-full">
        <div
          className="flex items-center w-full cursor-pointer px-1 py-2"
          onClick={() => handleCheckboxChange(!Discount)}
        >
          <Label className="w-full cursor-pointer">Descuento</Label>
          <Checkbox checked={Discount} />
        </div>
        <div
          className="flex items-center w-full cursor-pointer px-1 py-2"
          onClick={() => handleDiscontinuedCheckboxChange(!Discontinued)}
        >
          <Label className="w-full cursor-pointer">Discontinuados</Label>
          <Checkbox checked={Discontinued} />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
