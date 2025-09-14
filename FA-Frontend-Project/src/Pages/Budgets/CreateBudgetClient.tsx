import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useBudgetContext } from "@/Context/Budget/UseBudgetContext";
import { CreateClientDTO } from "@/hooks/SalesInterfaces";
import { useState } from "react";

const CreateBudgetClient = () => {
  const { CurrentBudget, updateCurrentBudget } = useBudgetContext();

  const [Client, setClient] = useState<CreateClientDTO>({
    name: "",
    type: "",
    address: "",
    phone: "",
    email: "",
    cuit_dni: "",
  });

  const createBudgetClient = () => {
    if (Client.name === "") {
      window.alert("El nombre del cliente no puede estar vacío.");
      return;
    }
    if (Client.type === "") {
      window.alert("Seleccione un tipo de cliente (A / B).");
      return;
    }
    updateCurrentBudget({
      ...CurrentBudget,
      clientId: undefined,
      client: Client,
    });
  };

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
        <Button onClick={createBudgetClient} className="w-full">
          Crear
        </Button>
      </div>
    </div>
  );
};
export default CreateBudgetClient;
