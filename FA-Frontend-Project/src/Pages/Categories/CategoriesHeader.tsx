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

export const CategoriesHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="flex listHeader">
      <h1 className="sectionTitle md:text-3xl text-2xl">Categorías</h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="md:text-lg text-md">
            <CirclePlus />
            Nueva Categoría
          </Button>
        </DialogTrigger>
        <DialogContent
          className="md:w-full w-[90%] md:p-6 p-3 rounded-lg"
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
