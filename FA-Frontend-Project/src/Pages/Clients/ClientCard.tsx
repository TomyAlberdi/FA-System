import { Button } from "@/components/ui/button";
import { PartialClient } from "@/hooks/SalesInterfaces";
import { Link } from "react-router-dom";

export const ClientCard = ({ client }: { client: PartialClient }) => {
  return (
    <Button
      asChild
      className="buttonCard h-[100px] w-[19.2%] min-w-[300px] max-w-[400px]"
    >
      <Link to={`/sales/clients/${client.id}`}>
        <h1>{client.name}</h1>
        <h3>Tipo {client.type}</h3>
      </Link>
    </Button>
  );
};
