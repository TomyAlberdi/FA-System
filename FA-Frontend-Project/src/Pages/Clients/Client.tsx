import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useClientContext } from "@/Context/Client/UseClientContext";
import { CompleteClient } from "@/hooks/SalesInterfaces";
import { ClientBudgets } from "@/Pages/Clients/ClientBudgets";
import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateClient } from "./UpdateClient";

export const Client = () => {
  const { id } = useParams();
  const { fetchClient, deleteClient, ClientUpdater } = useClientContext();
  const navigate = useNavigate();
  const [Client, setClient] = useState<CompleteClient | null>(null);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchClient(Number.parseInt(id))
        .then((result) => {
          if (!result) {
            navigate(-1);
          }
          setClient(result ?? null);
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, ClientUpdater]);

  const onDeletePres = () => {
    if (window.confirm("¿Desea eliminar el cliente?")) {
      submitDeleteClient();
    }
  };

  const submitDeleteClient = async () => {
    await deleteClient(Number(id));
  };

  return (
    <div className="h-full flex md:flex-row flex-col justify-start items-start">
      {Loading || !Client ? (
        <div className="loading md:w-1/5 h-1/5 w-[75%]">
          <h1 className="text-xl">Cargando...</h1>
          <Skeleton className="h-4 w-[100px]" />
        </div>
      ) : Client ? (
        <>
          <Card className="md:w-1/3 md:mr-5 mr-0 w-full">
            <CardHeader>
              <CardDescription className="text-xl">Cliente</CardDescription>
              <CardTitle className="md:text-4xl text-3xl">
                {Client?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-lg">
                Tipo:{" "}
                <span className="text-secondary-foreground">
                  {Client.type === "A"
                    ? "Responsable Inscripto (Tipo A)"
                    : "Consumidor Final (Tipo B)"}
                </span>
              </CardDescription>
              <CardDescription className="text-lg">
                Teléfono:{" "}
                <span className="text-secondary-foreground">
                  {Client.phone}
                </span>
              </CardDescription>
              <CardDescription className="text-lg">
                Email:{" "}
                <span className="text-secondary-foreground">
                  {Client.email}
                </span>
              </CardDescription>
              <CardDescription className="text-lg">
                {Client.type === "A" ? "CUIT" : "DNI"}:{" "}
                <span className="text-secondary-foreground">
                  {Client?.cuitDni}
                </span>
              </CardDescription>
              <CardDescription className="text-lg">
                Dirección:{" "}
                <span className="text-secondary-foreground">
                  {Client.address}
                </span>
              </CardDescription>
            </CardContent>
            <CardContent>
              <UpdateClient client={Client} />
              <Button
                variant="destructive"
                className="w-full mb-2"
                onClick={onDeletePres}
              >
                <CircleX />
                Eliminar
              </Button>
            </CardContent>
          </Card>
          <ScrollArea className="md:h-[85vh] md:w-2/3 w-full h-auto">
            <h2 className="text-xl text-muted-foreground md:pb-5 md:py-0 py-5 md:text-left text-center w-full">
              Lista de Presupuestos
            </h2>
            <ClientBudgets />
          </ScrollArea>
        </>
      ) : null}
    </div>
  );
};
