import { Skeleton } from "@/components/ui/skeleton";
import { useSalesContext } from "@/Context/UseSalesContext";
import { CompleteClient } from "@/hooks/SalesInterfaces";
import { useToast } from "@/hooks/use-toast";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CirclePlus, CircleX } from "lucide-react";
import { UpdateClient } from "./UpdateClient";
import { ToastAction } from "@/components/ui/toast";
import { ClientBudgets } from "@/Pages/Clients/ClientBudgets";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Client = () => {
  const { id } = useParams();
  const { fetchClient, BASE_URL } = useSalesContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getToken } = useKindeAuth();
  const [Client, setClient] = useState<CompleteClient | null>(null);
  const [Loading, setLoading] = useState(true);
  const [Reload, setReload] = useState(false);

  // Future implementation

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
  }, [id, Reload]);

  const onDeletePres = () => {
    toast({
      variant: "destructive",
      title: "Confirmación",
      description: "¿Desea eliminar el cliente?",
      action: (
        <ToastAction altText="Eliminar" onClick={deleteClient}>
          Eliminar
        </ToastAction>
      ),
    });
  };

  const deleteClient = async () => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/client/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error: ", response.statusText);
        toast({
          variant: "destructive",
          title: `Error ${response.status}`,
          description: `Ocurrió un error al eliminar el cliente.`,
        });
        return;
      }
      toast({
        title: "Cliente eliminado",
        description: "El cliente ha sido eliminado con éxito",
      });
      navigate("/sales/clients");
    } catch (error) {
      console.error("Error: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al eliminar el cliente",
      });
    }
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
              <Button asChild className="w-full mb-2">
                <Link to={`/sales/budgets/add`}>
                  <CirclePlus />
                  Crear Presupuesto
                </Link>
              </Button>
              <UpdateClient
                client={Client}
                setReload={setReload}
                Reload={Reload}
              />
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
