import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSalesContext } from "@/Context/UseSalesContext";
import { AddClient as AddClientInterface } from "@/hooks/SalesInterfaces";
import { useToast } from "@/hooks/use-toast";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface AddClientProps {
  handleRefresh?: () => void;
  setOpen: (value: boolean) => void;
}

export const AddClient = ({ handleRefresh, setOpen }: AddClientProps) => {
  const [LoadingRequest, setLoadingRequest] = useState(false);
  const { BASE_URL } = useSalesContext();
  const { getToken } = useKindeAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [Client, setClient] = useState<AddClientInterface>({
    name: "",
    type: "",
    address: "",
    phone: "",
    email: "",
    cuit_dni: "",
  });

  async function onSubmit(client: AddClientInterface) {
    const url = `${BASE_URL}/client`;
    setLoadingRequest(true);
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(client),
      });
      if (!response.ok) {
        console.error("Error: ", response.statusText);
        toast({
          variant: "destructive",
          title: `Error ${response.status}`,
          description: `Ocurrió un error al crear el cliente.`,
        });
        return;
      }
      toast({
        title: "Cliente creado",
        description: "El cliente ha sido creado con éxito",
      });
      const responseData = await response.json();
      navigate(`/sales/clients/${responseData.id}`);
    } catch (error) {
      console.error("Error: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al crear el cliente",
      });
    } finally {
      setOpen(false);
      setLoadingRequest(false);
      if (handleRefresh) {
        handleRefresh();
      }
    }
  }

  return (
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
          onChange={(e) => setClient({ ...Client, address: e.target.value })}
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
          value={Client.cuit_dni}
          onChange={(e) => setClient({ ...Client, cuit_dni: e.target.value })}
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
          onClick={() => onSubmit(Client)}
          className="w-full"
          disabled={LoadingRequest}
        >
          {LoadingRequest && <Loader2 className="animate-spin" />}
          Guardar
        </Button>
      </div>
    </div>
  );
};
