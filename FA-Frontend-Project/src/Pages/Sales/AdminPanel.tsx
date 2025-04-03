import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddClient } from "@/Pages/Clients/AddClient";

export const AdminPanel = () => {
  const navigate = useNavigate();

  const [ClientOpen, setClientOpen] = useState(false);
  //TODO: Add Create CashRegister Record button & Dialog

  return (
    <Card className="col-start-1 col-span-8 row-start-11 row-end-16">
      <CardHeader>
        <CardTitle>Atajos</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row space-x-1 h-2/3">
        <Dialog open={ClientOpen} onOpenChange={setClientOpen}>
          <DialogTrigger asChild>
            <Button className="h-full text-lg w-1/2">
              <CirclePlus className="bigger-icon" />
              Crear Cliente
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[500px] w-full p-6"
            aria-describedby={undefined}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Crear Cliente
              </DialogTitle>
            </DialogHeader>
            <AddClient setOpen={setClientOpen} />
          </DialogContent>
        </Dialog>
        <Button
          className="h-full text-lg w-1/2"
          onClick={() => navigate("/sales/budgets/add")}
        >
          <CirclePlus className="bigger-icon" />
          Crear Presupuesto
        </Button>
      </CardContent>
    </Card>
  );
};
