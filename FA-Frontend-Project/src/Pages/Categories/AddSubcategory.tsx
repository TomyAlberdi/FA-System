import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface SubcategoriesProps {
  LoadingRequest: boolean;
  setSubcategoryName: (value: string) => void;
  onSubmitSubcategory: () => void;
}

const AddSubcategory = ({
  LoadingRequest,
  setSubcategoryName,
  onSubmitSubcategory,
}: SubcategoriesProps) => {
  return (
    <DialogContent className="p-6" aria-describedby={undefined}>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">
          Añadir subcategoría
        </DialogTitle>
      </DialogHeader>
      <div className="w-full flex flex-col gap-4">
        <Label>Nombre</Label>
        <Input
          placeholder="Nombre de la categoría"
          onChange={(e) => setSubcategoryName(e.target.value)}
        />
        <Button
          onClick={onSubmitSubcategory}
          disabled={LoadingRequest}
          className="w-full"
        >
          {LoadingRequest && <Loader2 className="animate-spin" />}
          Guardar
        </Button>
      </div>
    </DialogContent>
  );
};
export default AddSubcategory;
