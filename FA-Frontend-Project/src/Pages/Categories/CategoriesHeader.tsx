import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export const CategoriesHeader = () => {
  return (
    <section className="listHeader">
      <h1 className="sectionTitle">Categorías</h1>
      <Button className="text-lg">
        <CirclePlus />
        Añadir Categoría
      </Button>
    </section>
  );
};
