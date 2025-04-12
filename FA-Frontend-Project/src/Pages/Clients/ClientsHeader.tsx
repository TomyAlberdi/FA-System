import { ClientsFilter } from "@/hooks/SalesInterfaces";
import { AddClient } from "@/Pages/Clients/AddClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CirclePlus, Search, SearchIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface ClientsHeaderProps {
  setFilters: React.Dispatch<React.SetStateAction<ClientsFilter>>;
  handleRefresh: () => void;
}

interface Search {
  keyword: string;
  type: "" | "A" | "B";
}

export const ClientsHeader = ({
  setFilters,
  handleRefresh,
}: ClientsHeaderProps) => {
  const [Search, setSearch] = useState<Search>({
    keyword: "",
    type: "",
  });

  async function obSumbit(data: Search) {
    setFilters(data);
  }

  const [Open, setOpen] = useState(false);

  return (
    <section className="flex listHeader">
      <h1 className="sectionTitle text-3xl">Clientes</h1>
      <div className="flex flex-row items-start justify-start gap-2 w-1/2">
        <Input
          placeholder="Buscar por nombre, DNI o CUIT"
          type="text"
          className="w-1/2 text-lg"
          onChange={(e) => setSearch({ ...Search, keyword: e.target.value })}
        />
        <Button onClick={() => obSumbit(Search)} type="submit" className="w-10">
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
          className="sm:max-w-[500px] w-full p-6"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Añadir Cliente
            </DialogTitle>
          </DialogHeader>
          <AddClient handleRefresh={handleRefresh} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </section>
  );
};
