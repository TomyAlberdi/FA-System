import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSalesContext } from "@/Context/UseSalesContext";
import { PartialBudget } from "@/hooks/SalesInterfaces";
import {
  AlertCircle,
  Clock8,
  CircleDollarSign,
  Truck,
  CircleCheck,
  Ban,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const ClientBudgets = () => {
  const { id } = useParams();
  const { fetchBudgetsByClient } = useSalesContext();
  const navigate = useNavigate();

  const [Budgets, setBudgets] = useState<Array<PartialBudget> | undefined>([]);

  useEffect(() => {
    if (id) {
      fetchBudgetsByClient(Number.parseInt(id)).then((result) => {
        setBudgets(result);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="CatalogPageList w-2/3">
      <h1 className="text-xl text-muted-foreground text-left pb-5">
        Lista de Presupuestos
      </h1>
      {!Budgets ? (
        <Alert variant="destructive" className="w-full mt-2">
          <AlertCircle className="w-5 pt-1" />
          <AlertTitle className="text-xl">Vacío</AlertTitle>
          <AlertDescription className="text-lg">
            El presupuesto no tiene productos asociados.
          </AlertDescription>
        </Alert>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-3/6">Fecha</TableHead>
              <TableHead className="w-2/6">Monto</TableHead>
              <TableHead className="w-1/6">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Budgets?.map((budget: PartialBudget, i) => {
              return (
                <TableRow
                  key={i}
                  className="text-lg cursor-pointer"
                  onClick={() => navigate(`/sales/budgets/${budget.id}`)}
                >
                  <TableCell>
                    {new Date(budget.date).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>$ {budget.finalAmount}</TableCell>
                  <TableCell className="flex flex-row items-center gap-2">
                    {budget.status}
                    {budget.status === "PENDIENTE" ? (
                      <Clock8 width={18} height={18} />
                    ) : budget.status === "PAGO" ? (
                      <CircleDollarSign width={18} height={18} />
                    ) : budget.status === "ENVIADO" ? (
                      <Truck width={18} height={18} />
                    ) : budget.status === "ENTREGADO" ? (
                      <CircleCheck width={18} height={18} />
                    ) : budget.status === "CANCELADO" ? (
                      <Ban width={18} height={18} />
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
