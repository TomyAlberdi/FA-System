import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  Loading,
}) => {
  const { Prices } = useCatalogContext();

  const [Data, setData] = useState<PriceCheck | null>(null);

  const [SelectedMinPrice, setSelectedMinPrice] = useState<number>(0);
  const [SelectedMaxPrice, setSelectedMaxPrice] = useState<number>(0);

  const [DisplaySelectedMinPrice, setDisplaySelectedMinPrice] =
    useState<number>(0);
  const [DisplaySelectedMaxPrice, setDisplaySelectedMaxPrice] =
    useState<number>(0);

  useEffect(() => {
    setData(Prices ?? null);
    setSelectedMinPrice(Prices?.minPrice ?? 0);
    setSelectedMaxPrice(Prices?.maxPrice ?? 0);
    setDisplaySelectedMinPrice(Prices?.minPrice ?? 0);
    setDisplaySelectedMaxPrice(Prices?.maxPrice ?? 0);
  }, [Prices]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SelectedMinPrice, SelectedMaxPrice]);

  return (
    <AccordionItem
      value="priceFilter"
      className="filterGroup w-full px-4 rounded-md mb-4"
      disabled={Loading}
    >
      <AccordionTrigger>Precios</AccordionTrigger>
      <AccordionContent className="pb-6 flex flex-col gap-5">
        {Data && Data?.minPrice === Data?.maxPrice ? (
          <div>
            <span className="text-sm text-gray-400">
              No hay precios disponibles
            </span>
          </div>
        ) : (
          Data && (
            <>
              <div className="pricesData w-full flex justify-between">
                <span>{DisplaySelectedMinPrice}</span>
                <span>{DisplaySelectedMaxPrice}</span>
              </div>
              <Slider
                min={Data.minPrice}
                max={Data.maxPrice}
                step={1}
                defaultValue={[Data.minPrice, Data.maxPrice]}
                minStepsBetweenThumbs={10}
                onValueChange={(value) => {
                  setDisplaySelectedMinPrice(value[0]);
                  setDisplaySelectedMaxPrice(value[1]);
                }}
                onValueCommit={(value) => {
                  setSelectedMinPrice(value[0]);
                  setSelectedMaxPrice(value[1]);
                }}
              />
            </>
          )
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
