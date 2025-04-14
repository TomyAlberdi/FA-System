import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FilterData } from "@/hooks/CatalogInterfaces";
import { Menu, Search } from "lucide-react";
import { CategoryFilter } from "@/Pages/Products/Filters/CategoryFilter";
import { ProviderFilter } from "@/Pages/Products/Filters/ProviderFilter";
import { MeasureFilter } from "@/Pages/Products/Filters/MeasureFilter";
import { PricesFilter } from "@/Pages/Products/Filters/PricesFilter";
import { DiscountFilter } from "@/Pages/Products/Filters/DiscountFilter";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface MobileFiltersProps {
  Filter: Array<FilterData | null>;
  setFilter: React.Dispatch<React.SetStateAction<Array<FilterData | null>>>;
  Loading: boolean;
}

const MobileFilters = ({ Filter, setFilter, Loading }: MobileFiltersProps) => {
  const [SearchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = () => {
    const newAppliedFilters = Filter?.filter(
      (filter) => filter?.type !== "keyword"
    );
    if (SearchTerm.length > 0) {
      newAppliedFilters?.push({
        type: "keyword",
        value: SearchTerm,
      });
    }
    setFilter(newAppliedFilters);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild className="flex md:hidden">
        <Button>
          <Menu className="large-icon" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Filtrado de Productos</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col w-full justify-start gap-2">
            <section className="flex px-2">
              <Input
                placeholder="Buscar por nombre o código"
                type="text"
                className="w-5/6 text-lg"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={SearchTerm}
              />
              <Button className="w-1/6" onClick={handleSearch}>
                <Search className="bigger-icon" />
              </Button>
            </section>
            <section className="flex flex-col gap-2">
              <Accordion type="multiple" className="filterAccordion w-full">
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
                <PricesFilter
                  Filter={Filter}
                  setFilter={setFilter}
                  Loading={Loading}
                />
                <DiscountFilter
                  Filter={Filter}
                  setFilter={setFilter}
                  Loading={Loading}
                />
              </Accordion>
            </section>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default MobileFilters;
