import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCategoryContext } from "@/Context/Category/UseCategoryContext";
import { useProviderContext } from "@/Context/Provider/UseProviderContext";
import { useSubcategoryContext } from "@/Context/Subcategory/UseSubcategoryContext";
import {
  Category,
  CreateProductDTO,
  Provider,
  Subcategory,
} from "@/hooks/CatalogInterfaces";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface BasicDataTabProps {
  onNext: () => void;
  Product: CreateProductDTO;
  setProduct: React.Dispatch<React.SetStateAction<CreateProductDTO>>;
}

const BasicDataTab = ({ onNext, Product, setProduct }: BasicDataTabProps) => {
  const { Categories } = useCategoryContext();
  const { Providers } = useProviderContext();
  const { fetchSubcategoriesByCategoryId } = useSubcategoryContext();

  //#green Fetch subcategories by category id if product has category id
  const [Subcategories, setSubcategories] = useState<Array<Subcategory>>([]);
  useEffect(() => {
    const selectedCategoryId = Product?.categoryId;
    if (selectedCategoryId) {
      fetchSubcategoriesByCategoryId(selectedCategoryId).then((result) =>
        setSubcategories(result ?? [])
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Product?.categoryId]);
  //#

  //#blue disable next button if product lacks required data
  const [DisableNext, setDisableNext] = useState(true);
  useEffect(() => {
    if (
      Product?.name &&
      Product?.code &&
      Product?.providerId &&
      Product?.categoryId &&
      Product?.subcategoryId
    ) {
      setDisableNext(false);
    } else {
      setDisableNext(true);
    }
  }, [
    Product?.name,
    Product?.code,
    Product?.providerId,
    Product?.categoryId,
    Product?.subcategoryId,
  ]);
  //#

  return (
    <TabsContent value="basicData" className="h-full w-full">
      <div className="h-full w-full md:grid grid-cols-6 grid-rows-9 gap-2 flex flex-col">
        <div className="row-start-1 col-span-4">
          <Label className="text-md">Nombre</Label>
          <Input
            value={Product?.name}
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div className="row-start-1 col-start-5">
          <Label className="text-md">Código</Label>
          <Input
            value={Product?.code}
            min={0}
            type="number"
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, code: e.target.value }))
            }
          />
        </div>
        <div className="row-start-1 col-start-6">
          <Label className="text-md">Calidad (Opcional)</Label>
          <Input
            value={Product?.quality}
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, quality: e.target.value }))
            }
            placeholder="Ej: 1ra"
          />
        </div>
        <div className="row-start-2 row-end-6 col-span-6">
          <Label className="text-md">Descripción</Label>
          <Textarea
            value={Product?.description}
            className="h-[90%]"
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>
        <div className="row-start-6 col-span-6">
          <Label className="text-md">Proveedor</Label>
          <Select
            disabled={Providers?.Loading}
            value={Product?.providerId.toString()}
            onValueChange={(value) =>
              setProduct((prev) => ({ ...prev, providerId: Number(value) }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Proveedor" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(Providers?.data) &&
                (Providers?.data as Provider[]).map(
                  (provider: Provider, index: number) => {
                    return (
                      <SelectItem
                        value={provider?.id ? provider.id.toString() : ""}
                        key={index}
                        className="cursor-pointer"
                      >
                        {provider.name}
                      </SelectItem>
                    );
                  }
                )}
            </SelectContent>
          </Select>
        </div>
        <div className="row-start-7 col-span-6">
          <Label className="text-md">Categoría</Label>
          <Select
            disabled={Categories?.Loading}
            value={Product?.categoryId.toString()}
            onValueChange={(value) =>
              setProduct((prev) => ({ ...prev, categoryId: Number(value) }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(Categories?.data) &&
                (Categories?.data as Category[]).map(
                  (category: Category, index: number) => {
                    return (
                      <SelectItem
                        value={category.id.toString()}
                        key={index}
                        className="cursor-pointer"
                      >
                        {category.name}
                      </SelectItem>
                    );
                  }
                )}
            </SelectContent>
          </Select>
        </div>
        <div className="row-start-8 col-span-6">
          <Label className="text-md">Subcategoría</Label>
          <Select
            disabled={Subcategories?.length === 0}
            value={Product?.subcategoryId.toString()}
            onValueChange={(value) =>
              setProduct((prev) => ({ ...prev, subcategoryId: Number(value) }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Subcategoría" />
            </SelectTrigger>
            <SelectContent>
              {Subcategories?.map((subcategory: Subcategory, index: number) => {
                return (
                  <SelectItem
                    value={subcategory.id.toString()}
                    key={index}
                    className="cursor-pointer"
                  >
                    {subcategory.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="row-start-9 col-span-2 col-start-3 flex flex-row justify-center items-center">
          <Button
            onClick={onNext}
            className="gap-2 w-full"
            disabled={DisableNext}
          >
            Siguiente
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </TabsContent>
  );
};
export default BasicDataTab;
