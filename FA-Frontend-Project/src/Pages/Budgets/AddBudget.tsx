import { CompleteClient } from "@/hooks/SalesInterfaces";
import { useLocation } from "react-router-dom";

export const AddBudget = () => {

  const location = useLocation();
  const { Client } = location.state as { Client: CompleteClient } || {};

  return (
    <div>
      {
        Client?.name || " no client"
      }
    </div>
  )
}