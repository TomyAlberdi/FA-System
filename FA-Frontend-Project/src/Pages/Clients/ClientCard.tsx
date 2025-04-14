import { Button } from "@/components/ui/button";
import { PartialClient } from "@/hooks/SalesInterfaces";
import { Link } from "react-router-dom";

export const ClientCard = ({ client }: { client: PartialClient }) => {
  return (
    <Button
      asChild
      className="buttonCard h-[100px] md:w-[19.2%] md:min-w-[300px] md:max-w-[400px] w-full"
    >
      <Link to={`/sales/clients/${client.id}`}>
        <h2 className="text-3xl">{client.name}</h2>
        <h3>
          Tipo {client.type}
          <span>
            {client.type === "A"
              ? " (Reponsable Inscripto)"
              : " (Consumidor Final)"}
          </span>
        </h3>
      </Link>
    </Button>
  );
};
