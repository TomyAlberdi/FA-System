import { Accordion } from "@/components/ui/accordion";
import { CategoryFilter } from "@/Pages/Products/Filters/CategoryFilter";
import { ProviderFilter } from "@/Pages/Products/Filters/ProviderFilter";
import { MeasureFilter } from "@/Pages/Products/Filters/MeasureFilter";
import { PricesFilter } from "@/Pages/Products/Filters/PricesFilter";
import { DiscountFilter } from "@/Pages/Products/Filters/DiscountFilter";
import { FilterData } from "@/hooks/CatalogInterfaces";

interface ProductFiltersProps {
  Filter: Array<FilterData | null>;
  setFilter: (value: Array<FilterData | null>) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  Filter,
  setFilter,
}) => {
  /* 
  {
    subcategoryId: "",
    providerId: "",
    measure: "",
    minPrice: 0,
    maxPrice: 0,
    discount: false,
  }
  */

  return (
    <section className="ProductFilters col-span-2">
      <Accordion
        type="multiple"
        className="filterAccordion w-full"
        defaultValue={[
          "categoryFilter",
          "providerFilter",
          "measureFilter",
          "priceFilter",
          "discountFilter",
        ]}
      >
        <CategoryFilter Filter={Filter} setFilter={setFilter} />
        <ProviderFilter Filter={Filter} setFilter={setFilter} />
        <MeasureFilter Filter={Filter} setFilter={setFilter} />
        <PricesFilter Filter={Filter} setFilter={setFilter} />
        <DiscountFilter Filter={Filter} setFilter={setFilter} />
      </Accordion>
    </section>
  );
};
