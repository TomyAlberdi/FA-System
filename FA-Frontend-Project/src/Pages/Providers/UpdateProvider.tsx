import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { Provider as ProviderInterface } from "@/hooks/CatalogInterfaces";
import { Label } from "@/components/ui/label";

export const UpdateProvider = ({
  provider,
  Reload,
  setReload,
}: {
  provider: ProviderInterface | null;
  Reload: boolean;
  setReload: (value: boolean) => void;
}) => {
  const [LoadingRequest, setLoadingRequest] = useState(false);
  const [Open, setOpen] = useState(false);

  const { BASE_URL, fetchProviders } = useCatalogContext();
  const { getToken } = useKindeAuth();

  const [Provider, setProvider] = useState<ProviderInterface>(
    provider ?? {
      name: "",
      locality: "",
      address: "",
      phone: "",
      email: "",
      cuit: "",
    }
  );

  const onSubmit = () => {
    if (Provider.name === "") {
      window.alert("El nombre del proveedor no puede estar vacío.");
      return;
    }
    if (Provider.name === provider?.name) {
      window.alert("El nombre del proveedor no puede ser igual al actual.");
      return;
    }
    submitProvider(Provider);
  };

  const submitProvider = async (provider: ProviderInterface) => {
    setLoadingRequest(true);
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/provider`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(provider),
      });
      if (!response.ok) {
        console.error("Error: ", response.statusText);
        window.alert(`Error actualizando el proveedor: ${response.status}`);
        return;
      }
      window.alert("Proveedor actualizado con éxito");
      fetchProviders();
      setReload(!Reload);
    } catch (error) {
      console.error("Error: ", error);
      window.alert("Ocurrió un error al actualizar el proveedor");
    } finally {
      setLoadingRequest(false);
      setOpen(false);
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
