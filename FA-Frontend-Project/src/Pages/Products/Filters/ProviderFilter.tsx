import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useProviderContext } from "@/Context/Provider/UseProviderContext";
import {
  Provider,
  BasicFilterCheck as ProviderCheck,
  BasicFilterProps as ProviderFilterProps,
} from "@/hooks/CatalogInterfaces";
import { useEffect, useState } from "react";

export const ProviderFilter: React.FC<ProviderFilterProps> = ({
  Filter,
  setFilter,
  Loading,
}) => {
  const { fetchProviders } = useProviderContext();
  const [Providers, setProviders] = useState<Provider[]>([]);
  const [LoadingProviders, setLoadingProviders] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoadingProviders(true);
      const result = await fetchProviders();
      setProviders(result);
      setLoadingProviders(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
    if (!LoadingProviders && Providers.length > 0) {
      if (Filter?.find((filter) => filter?.type === "providerId")) {
        return;
      }
      const checkedProviders: Array<ProviderCheck> = [];
      Providers.forEach((provider: Provider) => {
        const newItem: ProviderCheck = {
          id: provider?.id ?? 0,
          name: provider.name,
          productsAmount: provider.productsAmount ?? 0,
          checked: false,
        };
        checkedProviders.push(newItem);
      });
      setData(checkedProviders ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Filter, Providers]);

  return (
    <AccordionItem
      value="providerFilter"
      className="filterGroup w-full px-4 rounded-md mb-4"
      disabled={Loading}
    >
      <AccordionTrigger>Proveedores</AccordionTrigger>
      <AccordionContent>
        {Data && Data?.every((provider) => provider.productsAmount === 0) ? (
          <div>
            <p className="text-sm text-gray-400">
              No hay proveedores disponibles
            </p>
          </div>
        ) : (
          Data?.map((provider: ProviderCheck) => {
            return (
              provider.productsAmount > 0 && (
                <div
                  className="flex items-center w-full px-1 py-2"
                  key={provider.id}
                  onClick={() => handleCheckboxChange(provider.id)}
                >
                  <Checkbox
                    className="mr-2 cursor-pointer"
                    checked={provider.checked}
                    onCheckedChange={() => handleCheckboxChange(provider.id)}
                    disabled={provider.productsAmount === 0}
                  />
                  <Label
                    htmlFor={provider.name}
                    className="checkboxLabel text-sm w-full cursor-pointer"
                  >
                    {provider.name}
                    <span className="hidden md:block">
                      {provider.productsAmount}
                    </span>
                  </Label>
                </div>
              )
            );
          })
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
