import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PartialBudget } from "@/hooks/SalesInterfaces";
import { format } from "date-fns";
import {
  Ban,
  CircleCheck,
  CircleDollarSign,
  Clock8,
  Truck,
} from "lucide-react";
import { } from "react-day-picker";
import { Link } from "react-router-dom";

export const BudgetCard = ({ budget }: { budget: PartialBudget }) => {

  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy");
  };

  return (
    <Button
      asChild
      className="h-[100px] md:w-[19.2%] md:min-w-[300px] md:max-w-[400px] w-full mb-[1%] flex flex-row gap-2 justify-between p-2 cursor-pointer" 
    >
      <Link to={`/sales/budgets/${budget.id}`}>
        <div className="flex flex-col gap-2 justify-center items-center h-full w-2/3">
          <h3 className="text-2xl">{budget?.clientName}</h3>
          <span className="text-lg">$ {budget?.finalAmount}</span>
          <p>{formatDate(budget?.date)}</p>
        </div>
        <Separator orientation="vertical" />
        <div
          className={
            "w-1/3 flex flex-col gap-2 justify-center items-center h-full "
          }
        >
          {budget.status === "PENDIENTE" ? (
            <Clock8 className="bigger-icon" />
          ) : budget.status === "PAGO" ? (
            <CircleDollarSign className="bigger-icon" />
          ) : budget.status === "ENVIADO" ? (
            <Truck className="bigger-icon" />
          ) : budget.status === "ENTREGADO" ? (
            <CircleCheck className="bigger-icon" color="#48a584" />
          ) : budget.status === "CANCELADO" ? (
            <Ban className="bigger-icon" color="#f65a5a" />
          ) : null}
          <span>{budget.status}</span>
        </div>
      </Link>
    </Button>
  );
};
