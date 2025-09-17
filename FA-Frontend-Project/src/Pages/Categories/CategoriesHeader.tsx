import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger
} from "@/components/ui/dialog";
import { AddCategory } from "@/Pages/Categories/AddCategory";
import { CirclePlus } from "lucide-react";
import { useState } from "react";

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
        <AddCategory setOpen={setOpen} />
      </Dialog>
    </section>
  );
};
