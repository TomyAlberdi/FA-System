import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProviderContext } from "@/Context/Provider/UseProviderContext";
import { CreateProviderDTO } from "@/hooks/CatalogInterfaces";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface CategoriesHeaderProps {
  setOpen: (value: boolean) => void;
}

export const AddProvider: React.FC<CategoriesHeaderProps> = ({ setOpen }) => {
  const [LoadingRequest, setLoadingRequest] = useState(false);
  const { createProvider, fetchProviders } = useProviderContext();

  const [Provider, setProvider] = useState<CreateProviderDTO>({
    name: "",
    locality: "",
    address: "",
    phone: "",
    email: "",
    cuit: "",
  });

  const onSubmit = () => {
    if (Provider.name === "") {
      window.alert("El nombre del proveedor no puede estar vacío.");
      return;
    }
    submitProvider(Provider);
  };

  const submitProvider = async (provider: CreateProviderDTO) => {
    try {
      setLoadingRequest(true);
      await createProvider(provider);
      setOpen(false);
      window.alert("Proveedor creado con éxito");
      await fetchProviders();
    } catch (error) {
      console.error("Error: ", error);
      window.alert("Ocurrió un error al crear el proveedor");
    } finally {
      setLoadingRequest(false);
    }
  };

  return (
    <div className="w-full md:grid grid-cols-2 grid-rows-4 gap-4 flex flex-col">
      <section>
        <Label>Nombre</Label>
        <Input
          placeholder="Nombre del proveedor"
          onChange={(e) => {
            setProvider({
              ...Provider,
              name: e.target.value,
            });
          }}
          value={Provider?.name}
        />
      </section>
      <section>
        <Label>Localidad (Opcional)</Label>
        <Input
          placeholder="Localidad del proveedor"
          onChange={(e) => {
            setProvider({
              ...Provider,
              locality: e.target.value,
            });
          }}
          value={Provider?.locality}
        />
      </section>
      <section>
        <Label>Dirección (Opcional)</Label>
        <Input
          placeholder="Dirección del proveedor"
          onChange={(e) => {
            setProvider({
              ...Provider,
              address: e.target.value,
            });
          }}
          value={Provider?.address}
        />
      </section>
      <section>
        <Label>Teléfono (Opcional)</Label>
        <Input
          placeholder="Teléfono del proveedor"
          onChange={(e) => {
            setProvider({
              ...Provider,
              phone: e.target.value,
            });
          }}
          value={Provider?.phone}
        />
      </section>
      <section>
        <Label>Email (Opcional)</Label>
        <Input
          placeholder="Email del proveedor"
          onChange={(e) => {
            setProvider({
              ...Provider,
              email: e.target.value,
            });
          }}
          value={Provider?.email}
        />
      </section>
      <section>
        <Label>CUIT (Opcional)</Label>
        <Input
          placeholder="CUIT del proveedor"
          onChange={(e) => {
            setProvider({
              ...Provider,
              cuit: e.target.value,
            });
          }}
          value={Provider?.cuit}
        />
      </section>
      <div className="col-span-2 col-start-1 flex justify-center items-center">
        <Button onClick={onSubmit} className="w-full" disabled={LoadingRequest}>
          {LoadingRequest && <Loader2 className="animate-spin" />}
          Guardar
        </Button>
      </div>
    </div>
  );
};
