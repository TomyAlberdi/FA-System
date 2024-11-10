import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import {
  PriceCheck,
  BasicFilterProps as PricesFilterProps,
} from "@/hooks/CatalogInterfaces";
import { useEffect, useState } from "react";

export const PricesFilter: React.FC<PricesFilterProps> = ({
  Filter,
  setFilter,
}) => {
  const { fetchPrices } = useCatalogContext();

  const [Data, setData] = useState<PriceCheck | null>(null);

  const [SelectedMinPrice, setSelectedMinPrice] = useState<number>(0);
  const [SelectedMaxPrice, setSelectedMaxPrice] = useState<number>(0);

  useEffect(() => {
    fetchPrices().then((result) => {
      setData(result ?? null);
      setSelectedMinPrice(result?.minPrice ?? 0);
      setSelectedMaxPrice(result?.maxPrice ?? 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const newAppliedFilters = Filter?.filter(
      (filter) => filter?.type !== "minPrice" && filter?.type !== "maxPrice"
    );
    newAppliedFilters?.push({
      type: "minPrice",
      value: SelectedMinPrice,
    });
    newAppliedFilters?.push({
      type: "maxPrice",
      value: SelectedMaxPrice,
    });
    setFilter(newAppliedFilters);
  }, [SelectedMinPrice, SelectedMaxPrice, Filter, setFilter])

  if (Data) {
    return (
      <AccordionItem value="priceFilter" className="filterGroup w-full px-4 rounded-md mb-4">
        <AccordionTrigger>
          Precios
        </AccordionTrigger>
        <AccordionContent className="pb-6 flex flex-col gap-5">
          <div className="pricesData w-full flex justify-between">
            <span>{SelectedMinPrice}</span>
            <span>{SelectedMaxPrice}</span>
          </div>
          <Slider 
            min={Data.minPrice}
            max={Data.maxPrice}
            step={1}
            defaultValue={[Data.minPrice, Data.maxPrice]}
            onValueChange={(value) => {
              setSelectedMinPrice(value[0]);
              setSelectedMaxPrice(value[1]);
            }}
          />
        </AccordionContent>
      </AccordionItem>
    )
  }

};
