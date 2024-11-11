import { Accordion } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilterData } from "@/hooks/CatalogInterfaces";
import { CategoryFilter } from "@/Pages/Products/Filters/CategoryFilter";
import { useEffect, useState } from "react";
import { ProviderFilter } from "@/Pages/Products/Filters/ProviderFilter";
import { MeasureFilter } from "@/Pages/Products/Filters/MeasureFilter";
import { PricesFilter } from "@/Pages/Products/Filters/PricesFilter";
import { DiscountFilter } from "@/Pages/Products/Filters/DiscountFilter";

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
      <ScrollArea className="filterScrollArea">
        <Accordion type="multiple" className="filterAccordion w-full" defaultValue={["categoryFilter", "providerFilter", "measureFilter", "priceFilter", "discountFilter"]}>
          <CategoryFilter Filter={Filter} setFilter={setFilter} />
          <ProviderFilter Filter={Filter} setFilter={setFilter} />
          <MeasureFilter Filter={Filter} setFilter={setFilter} />
          <PricesFilter Filter={Filter} setFilter={setFilter} />
          <DiscountFilter Filter={Filter} setFilter={setFilter} />
        </Accordion>
      </ScrollArea>
    </section>
  );
};
