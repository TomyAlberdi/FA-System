import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCategoryContext } from "@/Context/Category/UseCategoryContext";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface CategoriesHeaderProps {
  setOpen: (value: boolean) => void;
}

export const AddCategory: React.FC<CategoriesHeaderProps> = ({ setOpen }) => {
  const [LoadingRequest, setLoadingRequest] = useState(false);

  const { createCategory, fetchCategories } = useCategoryContext();

  const [Name, setName] = useState<string>("");

  const onSubmit = () => {
    if (Name === "") {
      window.alert("El nombre de la categoría no puede estar vacío.");
      return;
    }
    submitCategory(Name);
  };

  const submitCategory = async (name: string) => {
    setLoadingRequest(true);
    try {
      await createCategory(name);
      setOpen(false);
      window.alert("Categoría creada con éxito");
      await fetchCategories();
    } catch (error) {
      console.error("Error: ", error);
      window.alert("Ocurrió un error al crear la categoría");
    } finally {
      setLoadingRequest(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Label>Nombre</Label>
      <Input
        placeholder="Nombre de la categoría"
        onChange={(e) => setName(e.target.value)}
        value={Name}
      />
      <Button onClick={onSubmit} disabled={LoadingRequest} className="w-full">
        {LoadingRequest && <Loader2 className="animate-spin" />}
        Guardar
      </Button>
    </div>
  );
};
