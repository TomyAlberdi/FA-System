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
import { AddClient } from "@/Pages/Clients/AddClient";
import { ClientsHeaderProps, Search } from "@/Pages/Clients/ClientsHeader";
import { CirclePlus, SearchIcon } from "lucide-react";
import { useState } from "react";

const MobileClientsHeader = ({ setFilters }: ClientsHeaderProps) => {
  const [Search, setSearch] = useState<Search>({
    keyword: "",
    type: "",
  });

  async function onSubmit(data: Search) {
    setFilters(data);
  }

  const [OpenSearch, setOpenSearch] = useState(false);
  const [OpenCreate, setOpenCreate] = useState(false);

  return (
    <div className="flex md:hidden listHeader">
      <h1 className="sectionTitle text-2xl">Clientes</h1>
      <div className="flex gap-4">
        <Dialog open={OpenSearch} onOpenChange={setOpenSearch}>
          <DialogTrigger asChild>
            <Button className="text-lg">
              <SearchIcon className="bigger-icon" />
            </Button>
          </DialogTrigger>
          <DialogContent
            className="w-[90%] md:w-full md:p-6 p-3 rounded-lg"
            aria-describedby={undefined}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Buscar Clientes
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div>
                <Label>Nombre, DNI o CUIT</Label>
                <Input
                  type="text"
                  className="w-full"
                  onChange={(e) =>
                    setSearch({ ...Search, keyword: e.target.value })
                  }
                />
              </div>
              <RadioGroup className="flex flex-col items-start md:mt-2 justify-evenly md:py-0 py-4 mt-0">
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
              <Button
                type="submit"
                className="w-full"
                onClick={() => onSubmit(Search)}
              >
                <SearchIcon className="bigger-icon" />
                Buscar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={OpenCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button className="text-lg">
              <CirclePlus className="bigger-icon" />
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
      </div>
    </div>
  );
};
export default MobileClientsHeader;
