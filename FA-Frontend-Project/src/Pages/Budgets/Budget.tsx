import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSalesContext } from "@/Context/UseSalesContext";
import { CompleteBudget } from "@/hooks/SalesInterfaces";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const Budget = () => {
  const { id } = useParams();
  const { fetchCompleteBudget } = useSalesContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [Budget, setBudget] = useState<CompleteBudget | null>(null);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCompleteBudget(Number.parseInt(id))
        .then((result) => {
          if (!result) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Ocurrió un error al obtener el presupuesto.",
            });
            navigate(-1);
          }
          setBudget(result ?? null);
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="flex flex-row gap-4">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle className="text-3xl">Presupuesto</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Separator />
          <div className="flex flex-col gap-2">
            <span className="text-lg">Cliente:</span>
            <span className="text-2xl">{Budget?.clientName}</span>
          </div>
        </CardContent>
        <CardContent className="flex flex-col gap-4">
          <Separator />
          <div className="flex flex-col gap-2">
            <span className="text-lg">Fecha:</span>
            <span className="text-2xl">
              {new Date(Budget?.date ?? "").toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
        </CardContent>
        <CardContent className="flex flex-col gap-4">
          <Separator />
          <div className="flex flex-col gap-2">
            <span className="text-lg">Estado:</span>
            <span className="text-2xl">{Budget?.status}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-lg">Monto final:</span>
            <span className="text-2xl">$ {Budget?.finalAmount}</span>
          </div>
        </CardContent>
      </Card>
      <div className="w-2/3"></div>
    </div>
  );
};
