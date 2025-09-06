import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProviderContext } from "@/Context/Provider/UseProviderContext";
import {
  CreateProviderDTO,
  Provider as ProviderInterface,
} from "@/hooks/CatalogInterfaces";
import { Loader2, Pencil } from "lucide-react";
import { useState } from "react";

interface UpdateProviderProps {
  defaultProvider: ProviderInterface | null;
}

export const UpdateProvider = ({ defaultProvider }: UpdateProviderProps) => {
  const [LoadingRequest, setLoadingRequest] = useState(false);
  const [Open, setOpen] = useState(false);

  const { fetchProviders, updateProvider } = useProviderContext();

  const [Provider, setProvider] = useState<CreateProviderDTO>({
    name: defaultProvider?.name ?? "",
    locality: defaultProvider?.locality ?? "",
    address: defaultProvider?.address ?? "",
    phone: defaultProvider?.phone ?? "",
    email: defaultProvider?.email ?? "",
    cuit: defaultProvider?.cuit ?? "",
  });

  const onSubmit = () => {
    if (Provider.name === "") {
      window.alert("El nombre del proveedor no puede estar vacío.");
      return;
    }
    submitProvider();
  };

  const submitProvider = async () => {
    try {
      await updateProvider(Number(defaultProvider?.id), Provider);
      window.alert("Proveedor actualizado con éxito");
      await fetchProviders();
      window.location.reload();
    } catch (error) {
      console.error("Error: ", error);
      window.alert("Ocurrió un error al actualizar el proveedor");
    } finally {
      setLoadingRequest(false);
    }
  };

  return (
    <Dialog open={Open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mb-2">
          <Pencil />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent
        className="md:w-full w-[90%] md:p-6 p-3 rounded-lg"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Editar proveedor
          </DialogTitle>
        </DialogHeader>
        <div className="w-full grid grid-cols-2 grid-rows-4 gap-4">
          <div className="col-start-1 row-start-1">
            <Label>Nombre</Label>
            <Input
              placeholder={Provider?.name}
              onChange={(e) => {
                setProvider({
                  ...Provider,
                  name: e.target.value,
                });
              }}
            />
          </div>
          <div className="col-start-1 row-start-2">
            <Label>Localidad (Opcional)</Label>
            <Input
              placeholder={Provider?.locality}
              onChange={(e) => {
                setProvider({
                  ...Provider,
                  locality: e.target.value,
                });
              }}
            />
          </div>
          <div className="col-start-1 row-start-3">
            <Label>Dirección (Opcional)</Label>
            <Input
              placeholder={Provider?.address}
              onChange={(e) => {
                setProvider({
                  ...Provider,
                  address: e.target.value,
                });
              }}
            />
          </div>
          <div className="col-start-2 row-start-1">
            <Label>Teléfono (Opcional)</Label>
            <Input
              placeholder={Provider?.phone}
              onChange={(e) => {
                setProvider({
                  ...Provider,
                  phone: e.target.value,
                });
              }}
            />
          </div>
          <div className="col-start-2 row-start-2">
            <Label>Email (Opcional)</Label>
            <Input
              placeholder={Provider?.email}
              onChange={(e) => {
                setProvider({
                  ...Provider,
                  email: e.target.value,
                });
              }}
            />
          </div>
          <div className="col-start-2 row-start-3">
            <Label>CUIT (Opcional)</Label>
            <Input
              placeholder={Provider?.cuit}
              onChange={(e) => {
                setProvider({
                  ...Provider,
                  cuit: e.target.value,
                });
              }}
            />
          </div>
          <div className="col-span-2 col-start-1 flex justify-center items-center">
            <Button
              className="w-full"
              disabled={LoadingRequest}
              onClick={onSubmit}
            >
              {LoadingRequest && <Loader2 className="animate-spin" />}
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
