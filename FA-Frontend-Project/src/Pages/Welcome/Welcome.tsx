import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Welcome = () => {
  const { login, isLoading } = useKindeAuth();

  return (
    <div className="Welcome">
      {isLoading ? (
        <div className="loading-welcome">
          <h1>Cargando...</h1>
          <Skeleton className="h-4 w-[100px]" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Falciglia & Alberdi S.A.</CardTitle>
            <CardDescription>Administración</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <Button onClick={() => login()} size={"lg"}>
              <Mail /> Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
