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
import { ClientsFilter } from "@/hooks/SalesInterfaces";
import { AddClient } from "@/Pages/Clients/AddClient";
import { CirclePlus, SearchIcon } from "lucide-react";
import { useState } from "react";

export interface ClientsHeaderProps {
  setFilters: React.Dispatch<React.SetStateAction<ClientsFilter>>;
}

export interface Search {
  keyword: string;
  type: "" | "A" | "B";
}

export const ClientsHeader = ({ setFilters }: ClientsHeaderProps) => {
  const [Search, setSearch] = useState<Search>({
    keyword: "",
    type: "",
  });

  async function onSubmit(data: Search) {
    setFilters(data);
  }

  const [Open, setOpen] = useState(false);

  return (
    <section className="listHeader hidden md:flex">
      <h1 className="sectionTitle text-3xl">Clientes</h1>
      <div className="flex flex-row items-start justify-start gap-2 w-1/2">
        <Input
          placeholder="Buscar por nombre, DNI o CUIT"
          type="text"
          className="w-1/2 text-lg"
          onChange={(e) => setSearch({ ...Search, keyword: e.target.value })}
        />
        <Button onClick={() => onSubmit(Search)} type="submit" className="w-10">
          <SearchIcon className="bigger-icon" />
        </Button>
        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="A"
              id="r1"
              onClick={() => setSearch({ ...Search, type: "A" })}
            />
            <Label htmlFor="r1">Responsable Inscripto (Tipo A)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="B"
              id="r2"
              onClick={() => setSearch({ ...Search, type: "B" })}
            />
            <Label htmlFor="r2">Consumidor Final (Tipo B)</Label>
          </div>
        </RadioGroup>
      </div>
      <Dialog open={Open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="text-lg">
            <CirclePlus />
            Nuevo Cliente
          </Button>
        </DialogTrigger>
        <DialogContent
          className="w-[90%] md:w-full md:p-6 p-3 rounded-lg"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Añadir Cliente
            </DialogTitle>
          </DialogHeader>
          <AddClient />
        </DialogContent>
      </Dialog>
    </section>
  );
};
