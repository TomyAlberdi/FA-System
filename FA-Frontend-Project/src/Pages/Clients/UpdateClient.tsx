import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil } from "lucide-react";
import { CompleteClient } from "@/hooks/SalesInterfaces";
import { useSalesContext } from "@/Context/UseSalesContext";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const UpdateClient = ({
  client,
  Reload,
  setReload,
}: {
  client: CompleteClient;
  Reload: boolean;
  setReload: (value: boolean) => void;
}) => {
  const [Open, setOpen] = useState(false);
  const [LoadingRequest, setLoadingRequest] = useState(false);
  const { getToken } = useKindeAuth();
  const { BASE_URL } = useSalesContext();
  const { toast } = useToast();

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

  const updateClient = async (data: CompleteClient) => {
    setLoadingRequest(true);
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/client`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        console.error("Error: ", response.statusText);
        toast({
          variant: "destructive",
          title: `Error ${response.status}`,
          description: `Ocurrió un error al actualizar el cliente.`,
        });
        return;
      }
      toast({
        title: "Cliente actualizado",
        description: "El cliente ha sido actualizado con éxito",
      });
      setReload(!Reload);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al actualizar el cliente",
      });
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
            Editar Cliente
          </DialogTitle>
        </DialogHeader>
        <div className="w-full md:grid grid-cols-2 grid-rows-5 gap-2">
          <div>
            <Label>Nombre</Label>
            <Input
              type="text"
              value={Client.name}
              onChange={(e) => setClient({ ...Client, name: e.target.value })}
              placeholder="Nombre"
              className="w-full"
            />
          </div>
          <div>
            <Label>Dirección (Opcional)</Label>
            <Input
              type="text"
              value={Client.address}
              onChange={(e) =>
                setClient({ ...Client, address: e.target.value })
              }
              placeholder="Dirección"
              className="w-full"
            />
          </div>
          <div>
            <Label>Teléfono (Opcional)</Label>
            <Input
              type="number"
              value={Client.phone}
              onChange={(e) => setClient({ ...Client, phone: e.target.value })}
              placeholder="Teléfono"
              className="w-full"
            />
          </div>
          <div>
            <Label>Email (Opcional)</Label>
            <Input
              type="email"
              value={Client.email}
              onChange={(e) => setClient({ ...Client, email: e.target.value })}
              placeholder="Email"
              className="w-full"
            />
          </div>
          <div>
            <Label>CUIT / DNI (Opcional)</Label>
            <Input
              type="number"
              value={Client.cuitDni}
              onChange={(e) =>
                setClient({ ...Client, cuitDni: e.target.value })
              }
              placeholder="CUIT / DNI"
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
              onClick={() => updateClient(Client)}
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
