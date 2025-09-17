import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useEffect, useState } from "react";

interface BasicDataTabProps {
  Product: CreateProductDTO;
  setProduct: React.Dispatch<React.SetStateAction<CreateProductDTO>>;
  loading: boolean;
}

const BasicDataTab = ({ Product, setProduct, loading }: BasicDataTabProps) => {
  const { Categories } = useCategoryContext();
  const { Providers } = useProviderContext();
  const { fetchSubcategoriesByCategoryId } = useSubcategoryContext();

  // Fetch subcategories by category id if product has category id
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

  return (
    <section className="w-full">
      <div className="h-full w-full gap-2 flex flex-col px-1">
        <section className="flex gap-2">
          <div className="w-4/6">
            <Label className="text-md">Nombre</Label>
            <Input
              disabled={loading}
              value={Product?.name}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="w-1/6">
            <Label className="text-md">Código</Label>
            <Input
              disabled={loading}
              value={Product?.code}
              min={0}
              type="number"
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, code: e.target.value }))
              }
            />
          </div>
          <div className="w-1/6">
            <Label className="text-md">Calidad (Opcional)</Label>
            <Input
              value={Product?.quality}
              disabled={loading}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, quality: e.target.value }))
              }
              placeholder="Ej: 1ra"
            />
          </div>
        </section>

        <div className="row-start-2 row-end-6 col-span-6">
          <Label className="text-md">Descripción</Label>
          <Textarea
            value={Product?.description}
            disabled={loading}
            className="h-[90%]"
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>
        <div className="row-start-6 col-span-6">
          <Label className="text-md">Proveedor</Label>
          <Select
            disabled={Providers?.Loading || loading}
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
            disabled={Categories?.Loading || loading}
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
            disabled={Subcategories?.length === 0 || loading}
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
      </div>
    </section>
  );
};
export default BasicDataTab;
