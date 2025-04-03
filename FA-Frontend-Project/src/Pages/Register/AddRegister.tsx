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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useSalesContext } from "@/Context/UseSalesContext";
import { RegisterRecord } from "@/hooks/SalesInterfaces";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, CirclePlus, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";

const AddRegister = ({ yearMonth }: { yearMonth?: string }) => {
  const { BASE_URL, fetchRegisterTypes, fetchRegisterTotalAmount } =
    useSalesContext();
  const { toast } = useToast();
  const [Open, setOpen] = useState(false);
  const [Record, setRecord] = useState<RegisterRecord>({
    amount: 0,
    date: "",
    detail: "",
    type: "",
  });

  const [LongDate, setLongDate] = useState<Date>(new Date());
  useEffect(() => {
    if (LongDate) {
      const date = new Date(LongDate?.toISOString());
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(date.getDate()).padStart(2, "0");
      setRecord({ ...Record, date: `${year}-${month}-${day}` });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [LongDate]);

  const submitRegister = async () => {
    const url = `${BASE_URL}/cash-register`;
    const body = JSON.stringify(Record);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });
      if (!response.ok) {
        console.error("Error submitting register: ", response.status);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al crear el registro.",
        });
        return;
      }
      setOpen(false);
      fetchRegisterTypes(yearMonth ?? new Date().toISOString().slice(0, 7));
      fetchRegisterTotalAmount();
    } catch (error) {
      console.error("Error submitting register: ", error);
    }
  };

  return (
    <Dialog open={Open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={`flex flex-row flex-wrap text-lg ${
            yearMonth ? "w-full" : "h-full w-1/3"
          }`}
        >
          {yearMonth ? (
            <>
              <DollarSign className="big-icon" />
              Modificar
            </>
          ) : (
            <>
              <CirclePlus className="bigger-icon" />
              Añadir Registro de Caja
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="p-6 max-w-[60vw]">
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
                selected={LongDate}
                onSelect={(date) => date && setLongDate(date)}
                disabled={(date) => date > new Date()}
              />
            </div>
            <div className="flex flex-col justify-start gap-6 w-full">
              <div className="flex flex-col gap-2 w-full h-1/2">
                <Label>Detalle:</Label>
                <Textarea
                  onChange={(e) =>
                    setRecord({ ...Record, detail: e.target.value })
                  }
                  className="w-full h-full"
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Label>Tipo de operación:</Label>
                <RadioGroup
                  onValueChange={(value) =>
                    setRecord({ ...Record, type: value })
                  }
                  value={Record.type}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="INGRESO" id="r1" />
                    <Label htmlFor="r1" className="text-xl">
                      Ingreso
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="GASTO" id="r2" />
                    <Label htmlFor="r2" className="text-xl">
                      Gasto
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <Button onClick={submitRegister}>
                <CheckCircle2 className="w-5 h-5" />
                Registrar
              </Button>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AddRegister;
