import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import {
  Measure,
  MeasureCheck,
  BasicFilterProps as MeasureFilterProps,
} from "@/hooks/CatalogInterfaces";
import { useEffect, useState } from "react";

export const MeasureFilter: React.FC<MeasureFilterProps> = ({
  Filter,
  setFilter,
}) => {
  const { fetchMeasures } = useCatalogContext();
  const [Data, setData] = useState<Array<MeasureCheck> | null>([]);

  const handleCheckboxChange = (id: number) => {
    // Remove all filters with type "measure"
    const newAppliedFilters = Filter?.filter(
      (filter) => filter?.type !== "measure"
    );

    // Update the checked state of the checkbox
    const updatedItems = Data?.map((item) => {
      if (item.id === id) {
        // Checks if the checkbox is checked
        const newChecked = !item.checked;
        // If the checkbox is checked, add the filter to the appliedFilters array
        if (newChecked) {
          newAppliedFilters?.push({
            type: "measure",
            value: item.measure,
          });
        }
        return { ...item, checked: newChecked };
      }
      return { ...item, checked: false };
    });
    // Update the filter array with the new filter checked
    setFilter(newAppliedFilters);
    // Update the checkboxes data
    setData(updatedItems ?? null);
  };

  useEffect(() => {
    fetchMeasures().then((result) => {
      const checkedMeasures: Array<MeasureCheck> = [];
      result?.forEach((measure: Measure, i: number) => {
        const newItem: MeasureCheck = {
          id: i,
          measure: measure.measure,
          productsAmount: measure.productsAmount,
          checked: false,
        };
        checkedMeasures.push(newItem);
      });
      setData(checkedMeasures ?? null);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (Data) {
    return (
      <AccordionItem
        value="measureFilter"
        className="filterGroup w-full px-4 rounded-md mb-4"
      >
        <AccordionTrigger>Medidas</AccordionTrigger>
        <AccordionContent>
          {Data?.map((measure: MeasureCheck) => {
            return (
              <div
                className="flex items-center w-full cursor-pointer px-1 py-2"
                key={measure.id}
              >
                <Checkbox
                  className="mr-2"
                  checked={measure.checked}
                  onCheckedChange={() => handleCheckboxChange(measure.id)}
                />
                <Label
                  htmlFor={measure.measure}
                  className="checkboxLabel text-sm w-full"
                >
                  {measure.measure}
                  <span>{measure.productsAmount}</span>
                </Label>
              </div>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    );
  }
};
