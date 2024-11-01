import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { useEffect, useState } from "react";
import { Category, BasicFilterCheck as CategoryCheck, BasicFilterProps as CategoryFilterProps } from "@/hooks/catalogInterfaces";

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  Filter,
  setFilter,
}) => {
  const { fetchCategories } = useCatalogContext();
  const [Data, setData] = useState<Array<CategoryCheck> | null>([]);

  const handleCheckboxChange = (id: number) => {
    // Remove all filters with type "categoryId"
    const newAppliedFilters = Filter?.filter(
      (filter) => filter?.type !== "categoryId"
    );

    // Update the checked state of the checkbox
    const updatedItems = Data?.map((item) => {
      if (item.id === id) {
        // Checks if the checkbox is checked
        const newChecked = !item.checked;
        // If the checkbox is checked, add the filter to the appliedFilters array
        if (newChecked) {
          newAppliedFilters?.push({
            type: "categoryId",
            value: item.id,
          });
        }
        return {...item, checked: newChecked}
      }
      return {...item, checked: false}
    })
    // Update the filter array with the new filter checked
    setFilter(newAppliedFilters);
    // Update the checkboxes data
    setData(updatedItems ?? null);
  }

  useEffect(() => {
    fetchCategories().then((result) => {
      const checkedCategories: Array<CategoryCheck> = [];
      result?.forEach((category: Category) => {
        const newItem: CategoryCheck = {
          id: category.id,
          name: category.name,
          productsAmount: category.productsAmount,
          checked: false,
        }
        checkedCategories.push(newItem);
      });
      setData(checkedCategories ?? null)
    });
    console.log(Data)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (Data) {
    return (
      <AccordionItem
        value="categoryFilter"
        className="filterGroup w-full px-4 rounded-md"
      >
        <AccordionTrigger>Categorías</AccordionTrigger>
        <AccordionContent>
          {Data?.map((category: CategoryCheck) => {
            return (
              <div
                className="flex items-center w-full cursor-pointer px-4 py-2"
                key={category.id}
              >
                <Checkbox
                  className="mr-2"
                  checked={category.checked}
                  onCheckedChange={() => handleCheckboxChange(category.id)}
                />
                <Label htmlFor={category.name} className="checkboxLabel text-sm w-full">
                  {category.name}
                  <span>{category.productsAmount}</span>
                </Label>
              </div>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    );
  }

};
