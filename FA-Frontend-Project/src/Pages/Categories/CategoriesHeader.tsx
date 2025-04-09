import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { AddCategory } from "@/Pages/Categories/AddCategory";

//TODO: Mobile Add Category Dialog
export const CategoriesHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="flex listHeader">
      <h1 className="sectionTitle">Categorías</h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="text-lg">
            <CirclePlus />
            Nueva Categoría
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[500px] w-full p-6"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Añadir Categoría
            </DialogTitle>
          </DialogHeader>
          <AddCategory setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </section>
  );
};
