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
  Loading: boolean;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  Filter,
  setFilter,
  Loading,
}) => {
  return (
    <section className="ProductFilters col-span-2 hidden md:block">
      <Accordion
        type="multiple"
        className="filterAccordion w-full"
      >
        <CategoryFilter
          Filter={Filter}
          setFilter={setFilter}
          Loading={Loading}
        />
        <ProviderFilter
          Filter={Filter}
          setFilter={setFilter}
          Loading={Loading}
        />
        <MeasureFilter
          Filter={Filter}
          setFilter={setFilter}
          Loading={Loading}
        />
        <PricesFilter Filter={Filter} setFilter={setFilter} Loading={Loading} />
        <DiscountFilter
          Filter={Filter}
          setFilter={setFilter}
          Loading={Loading}
        />
      </Accordion>
    </section>
  );
};
