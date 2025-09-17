import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  const { createCategory } = useCategoryContext();

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
    await createCategory(name).finally(() => {
      setLoadingRequest(false);
      setOpen(false);
    });
  };

  return (
    <DialogContent
      className="md:w-full w-[90%] md:p-6 p-3 rounded-lg"
      aria-describedby={undefined}
    >
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">
          Añadir Categoría
        </DialogTitle>
      </DialogHeader>
      <div className="w-full flex flex-col gap-4">
        <section>
          <Label>Nombre</Label>
          <Input
            placeholder="Nombre de la categoría"
            onChange={(e) => setName(e.target.value)}
            value={Name}
          />
        </section>
        <div>
          <Button
            onClick={onSubmit}
            disabled={LoadingRequest}
            className="w-full"
          >
            {LoadingRequest && <Loader2 className="animate-spin" />}
            Guardar
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};
