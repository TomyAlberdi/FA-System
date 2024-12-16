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

interface ProvidersHeaderProps {
  setUpdateData: (value: boolean) => void;
  UpdateData: boolean;
}

export const ProvidersHeader: React.FC<ProvidersHeaderProps> = ({
  setUpdateData,
  UpdateData,
}) => {
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
          <AddProvider
            setUpdateData={setUpdateData}
            UpdateData={UpdateData}
            setOpen={setOpen}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
};
