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
    <div className="CatalogPage h-full">
      {Loading || !Client ? (
        <div className="loading w-1/5 h-1/5">
          <h1 className="text-xl">Cargando...</h1>
          <Skeleton className="h-4 w-[100px]" />
        </div>
      ) : Client ? (
        <section className="CatalogPageData h-full w-full">
          <div className="CatalogPageInfo h-2/3 w-1/3">
            <Card className="w-5/6">
              <CardHeader>
                <CardDescription>Cliente</CardDescription>
                <CardTitle className="text-4xl">{Client?.name}</CardTitle>
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
                  <Link
                    to={`/sales/budgets/add`}
                    state={{
                      Client,
                    }}
                  >
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
          </div>
          <ClientBudgets />
        </section>
      ) : null}
    </div>
  );
};
