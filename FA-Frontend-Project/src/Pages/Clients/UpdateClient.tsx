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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useClientContext } from "@/Context/Client/UseClientContext";
import { CompleteClient, CreateClientDTO } from "@/hooks/SalesInterfaces";
import { Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

export const UpdateClient = ({
  client,
}: {
  client: CompleteClient;
}) => {
  const [Open, setOpen] = useState(false);
  const [LoadingRequest, setLoadingRequest] = useState(false);
  const { updateClient } = useClientContext();

  const [Client, setClient] = useState<CompleteClient>({
    id: 0,
    name: "",
    type: "",
    address: "",
    phone: "",
    email: "",
    cuitDni: "",
  });

  useEffect(() => {
    setClient({
      id: client?.id ?? 0,
      name: client?.name ?? "",
      type: (client?.type as "A" | "B") ?? "A",
      address: client?.address ?? "",
      phone: client?.phone ?? "",
      email: client?.email ?? "",
      cuitDni: client?.cuitDni ?? "",
    });
  }, [client]);

  const onSubmit = () => {
    if (Client.name === "") {
      window.alert("El nombre del cliente no puede estar vacío.");
      return;
    }
    if (Client.type === "") {
      window.alert("Seleccione un tipo de cliente (A / B).");
      return;
    }
    submitClient(Client);
  };

  const submitClient = async (data: CompleteClient) => {
    setLoadingRequest(true);
    const clientWithoutId: CreateClientDTO = {
      name: data.name,
      type: data.type,
      address: data.address,
      phone: data.phone,
      email: data.email,
      cuitDni: data.cuitDni,
    };
    await updateClient(data.id, clientWithoutId).finally(() =>
      setLoadingRequest(false)
    );
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
            Editar Cliente
          </DialogTitle>
        </DialogHeader>
        <div className="w-full md:grid grid-cols-2 grid-rows-5 gap-2">
          <div>
            <Label>Nombre</Label>
            <Input
              type="text"
              onChange={(e) => setClient({ ...Client, name: e.target.value })}
              placeholder={Client.name}
              className="w-full"
            />
          </div>
          <div>
            <Label>Dirección (Opcional)</Label>
            <Input
              type="text"
              onChange={(e) =>
                setClient({ ...Client, address: e.target.value })
              }
              placeholder={Client.address}
              className="w-full"
            />
          </div>
          <div>
            <Label>Teléfono (Opcional)</Label>
            <Input
              type="number"
              onChange={(e) => setClient({ ...Client, phone: e.target.value })}
              placeholder={Client.phone}
              className="w-full"
            />
          </div>
          <div>
            <Label>Email (Opcional)</Label>
            <Input
              type="email"
              onChange={(e) => setClient({ ...Client, email: e.target.value })}
              placeholder={Client.email}
              className="w-full"
            />
          </div>
          <div>
            <Label>CUIT / DNI (Opcional)</Label>
            <Input
              type="number"
              onChange={(e) =>
                setClient({ ...Client, cuitDni: e.target.value })
              }
              placeholder={Client.cuitDni}
              className="w-full"
            />
          </div>
          <div className="col-span-2 col-start-1">
            <Label>Tipo</Label>
            <RadioGroup className="flex items-center md:mt-2 justify-evenly md:py-0 py-4 mt-0">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="A"
                  id="r1"
                  onClick={() => setClient({ ...Client, type: "A" })}
                />
                <Label htmlFor="r1">Responsable Inscripto (Tipo A)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="B"
                  id="r2"
                  onClick={() => setClient({ ...Client, type: "B" })}
                />
                <Label htmlFor="r2">Consumidor Final (Tipo B)</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="col-span-2 col-start-1 flex justify-center items-center">
            <Button
              onClick={() => onSubmit()}
              className="w-full"
              disabled={LoadingRequest}
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
