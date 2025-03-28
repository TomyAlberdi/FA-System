import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterRecord } from "@/hooks/SalesInterfaces";
import { DollarSign } from "lucide-react";
import { useState } from "react";

const AddRegister = () => {
  const [Open, setOpen] = useState(false);
  const [Record, setRecord] = useState<RegisterRecord>({
    amount: 0,
    date: "",
    detail: "",
    type: 0,
  });

  function formatToJavaLocalDate(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");

    setRecord({ ...Record, date: `${year}-${month}-${day}` });
  }

  return (
    <Dialog open={Open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full text-lg">
          <DollarSign className="big-icon" />
          Modificar
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="p-6">
        <DialogTitle>Añadir Registro</DialogTitle>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Monto:</Label>
            <Input
              type="number"
              className="w-full"
              onChange={(e) =>
                setRecord({ ...Record, amount: Number(e.target.value) })
              }
            />
          </div>
          <section className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <Label>Fecha:</Label>
              <Calendar
                mode="single"
                onSelect={(date) =>
                  date && formatToJavaLocalDate(date.toISOString())
                }
                disabled={(date) => date > new Date()}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div></div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AddRegister;
