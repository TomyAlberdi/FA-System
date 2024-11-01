import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import {
  BasicFilterProps as ProviderFilterProps,
  BasicFilterCheck as ProviderCheck,
  Provider,
} from "@/hooks/catalogInterfaces";
import { useEffect, useState } from "react";

export const ProviderFilter: React.FC<ProviderFilterProps> = ({
  Filter,
  setFilter,
}) => {
  const { fetchProviders } = useCatalogContext();
  const [Data, setData] = useState<Array<ProviderCheck> | null>([]);

  const handleCheckboxChange = (id: number) => {
    // Remove all filters with type "providerId"
    const newAppliedFilters = Filter?.filter(
      (filter) => filter?.type !== "providerId"
    );

    // Update the checked state of the checkbox
    const updatedItems = Data?.map((item) => {
      if (item.id === id) {
        // Checks if the checkbox is checked
        const newChecked = !item.checked;
        // If the checkbox is checked, add the filter to the appliedFilters array
        if (newChecked) {
          newAppliedFilters?.push({
            type: "providerId",
            value: item.id,
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
    fetchProviders().then((result) => {
      const checkedProviders: Array<ProviderCheck> = [];
      result?.forEach((provider: Provider) => {
        const newItem: ProviderCheck = {
          id: provider.id,
          name: provider.name,
          productsAmount: provider.productsAmount,
          checked: false,
        };
        checkedProviders.push(newItem);
      });
      setData(checkedProviders ?? null);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (Data) {
    return (
      <AccordionItem
        value="providerFilter"
        className="filterGroup w-full px-4 rounded-md"
      >
        <AccordionTrigger>Proveedores</AccordionTrigger>
        <AccordionContent>
          {Data?.map((provider: ProviderCheck) => {
            return (
              <div
                className="flex items-center w-full cursor-pointer px-4 py-2"
                key={provider.id}
              >
                <Checkbox
                  className="mr-2"
                  checked={provider.checked}
                  onCheckedChange={() => handleCheckboxChange(provider.id)}
                />
                <Label
                  htmlFor={provider.name}
                  className="checkboxLabel text-sm w-full"
                >
                  {provider.name}
                  <span>{provider.productsAmount}</span>
                </Label>
              </div>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    );
  }
};
