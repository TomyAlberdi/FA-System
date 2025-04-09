import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { AddProvider } from "@/Pages/Providers/AddProvider";

export const ProvidersHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="flex listHeader">
      <h1 className="sectionTitle">Proveedores</h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="md:text-lg text-md">
            <CirclePlus />
            Nuevo Proveedor
          </Button>
        </DialogTrigger>
        <DialogContent
          className="w-[90%] md:w-full md:p-6 p-3 rounded-lg"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Añadir Proveedor
            </DialogTitle>
          </DialogHeader>
          <AddProvider setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </section>
  );
};
