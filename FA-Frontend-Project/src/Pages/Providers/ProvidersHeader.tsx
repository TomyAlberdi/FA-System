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
    <section className="listHeader">
      <h1 className="sectionTitle">Proveedores</h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="text-lg">
            <CirclePlus />
            Nuevo Proveedor
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[500px] w-full"
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
