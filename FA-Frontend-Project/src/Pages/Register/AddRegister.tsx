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
import { CheckCircle2, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";

interface AddRegisterProps {
  yearMonth?: string;
}

const AddRegister = ({ yearMonth }: AddRegisterProps) => {
  const { BASE_URL, fetchRegisterTypes, fetchRegisterTotalAmount } =
    useSalesContext();
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

  const [LoadingRequest, setLoadingRequest] = useState(false);

  const validateRecord = (): string | null => {
    if (Record.amount === 0) return "La cantidad no puede ser 0.";
    if (Record.amount < 0) return "La cantidad no puede ser menor a 0.";
    if (Record.type === "") return "Seleccione un tipo de operación.";
    if (Record.date === "") return "Seleccione una fecha.";
    return null;
  };

  const onSubmit = () => {
    const error = validateRecord();
    if (error) {
      window.alert(error);
      return;
    }
    submitRegister(Record);
  };

  const submitRegister = async (Record: RegisterRecord) => {
    const url = `${BASE_URL}/cash-register`;
    setLoadingRequest(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Record),
      });
      if (!response.ok) {
        console.error("Error submitting register: ", response.status);
        window.alert(`Error creando el registro: ${response.status}`);
        return;
      }
      setOpen(false);
      await Promise.all([
        fetchRegisterTypes(yearMonth ?? new Date().toISOString().slice(0, 7)),
        fetchRegisterTotalAmount(),
      ]);
    } catch (error) {
      console.error("Error submitting register: ", error);
      window.alert("Ocurrió un error al crear el registro");
    } finally {
      setLoadingRequest(false);
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
            <>Registrar en Caja</>
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
              <Button onClick={onSubmit} disabled={LoadingRequest}>
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
