import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useSubcategoryContext } from "@/Context/Subcategory/UseSubcategoryContext";
import {
  BasicFilterCheck as CategoryCheck,
  BasicFilterProps as CategoryFilterProps,
  Subcategory,
} from "@/hooks/CatalogInterfaces";
import { useEffect, useState } from "react";

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  Filter,
  setFilter,
  Loading,
}) => {
  const { Subcategories } = useSubcategoryContext();
  const [Data, setData] = useState<Array<CategoryCheck> | null>([]);

  const handleCheckboxChange = (id: number) => {
    // Remove all filters with type "categoryId"
    const newAppliedFilters = Filter?.filter(
      (filter) => filter?.type !== "subcategoryId"
    );

    // Update the checked state of the checkbox
    const updatedItems = Data?.map((item) => {
      if (item.id === id) {
        // Checks if the checkbox is checked
        const newChecked = !item.checked;
        // If the checkbox is checked, add the filter to the appliedFilters array
        if (newChecked) {
          newAppliedFilters?.push({
            type: "subcategoryId",
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
    if (
      Subcategories &&
      Array.isArray(Subcategories.data) &&
      Subcategories?.data.length > 0
    ) {
      if (Filter?.find((filter) => filter?.type === "subcategoryId")) {
        return;
      }
      const checkedCategories: Array<CategoryCheck> = [];
      Subcategories.data.forEach((category: Subcategory) => {
        const newItem: CategoryCheck = {
          id: category.id,
          name: category.name,
          productsAmount: category.productsAmount,
          checked: false,
        };
        checkedCategories.push(newItem);
      });
      setData(checkedCategories ?? null);
    }
  }, [Filter, Subcategories]);

  return (
    <AccordionItem
      value="categoryFilter"
      className="filterGroup w-full px-4 rounded-md mb-4"
      disabled={Loading}
    >
      <AccordionTrigger>Subcategorías</AccordionTrigger>
      <AccordionContent>
        {Data && Data?.every((category) => category.productsAmount === 0) ? (
          <div>
            <p className="text-sm text-gray-400">
              No hay subcategorías disponibles
            </p>
          </div>
        ) : (
          Data &&
          Data?.map((category: CategoryCheck) => {
            return (
              category.productsAmount > 0 && (
                <div
                  className="flex items-center w-full px-1 py-2"
                  key={category.id}
                  onClick={() => handleCheckboxChange(category.id)}
                >
                  <Checkbox
                    className="mr-2 cursor-pointer"
                    checked={category.checked}
                    onCheckedChange={() => handleCheckboxChange(category.id)}
                    disabled={category.productsAmount === 0}
                  />
                  <Label
                    htmlFor={category.name}
                    className="checkboxLabel text-sm w-full cursor-pointer"
                  >
                    {category.name}
                    <span className="hidden md:block">
                      {category.productsAmount}
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
