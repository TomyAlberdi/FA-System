import { Accordion } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilterData } from "@/hooks/catalogInterfaces";
import { CategoryFilter } from "@/Pages/Products/Filters/CategoryFilter";
import { useEffect, useState } from "react";

export const ProductFilters = () => {

  const [Filter, setFilter] = useState<Array<FilterData | null>>([]);

  useEffect(() => {
    console.log(Filter)
  }, [Filter])

  /* 
  {
    categoryId: "",
    providerId: "",
    measure: "",
    minPrice: 0,
    maxPrice: 0,
    discount: false,
  }
  */

  return (
    <section className="ProductFilters col-span-2">
      <ScrollArea>
        <Accordion type="single" collapsible className="filterAccordion w-full">
          <CategoryFilter Filter={Filter} setFilter={setFilter} />
        </Accordion>
      </ScrollArea>
    </section>
  );
};
