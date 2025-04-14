import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { useToast } from "@/hooks/use-toast";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CategoriesHeaderProps {
  setOpen: (value: boolean) => void;
}

export const AddCategory: React.FC<CategoriesHeaderProps> = ({ setOpen }) => {
  const [LoadingRequest, setLoadingRequest] = useState(false);

  const { BASE_URL, fetchCategories } = useCatalogContext();
  const { getToken } = useKindeAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [Name, setName] = useState<string>("");

  const onSubmit = () => {
    if (Name === "") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El nombre de la categoría no puede estar vacío.",
      });
      return;
    }
    submitCategory(Name);
  };

  const submitCategory = async (name: string) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      setLoadingRequest(true);
      const response = await fetch(`${BASE_URL}/category/${name}`, {
        method: "POST",
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
          description: `Ocurrió un error al completar la creación de la categoría.`,
        });
        return;
      }
      toast({
        title: "Categoría creada",
        description: "La categoría ha sido creada con éxito",
      });
      fetchCategories();
      const responseData = await response.json();
      navigate(`/catalog/categories/${responseData.id}`);
    } catch (error) {
      console.error("Error: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al crear la categoría",
      });
    } finally {
      setOpen(false);
      setLoadingRequest(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Label>Nombre</Label>
      <Input
        placeholder="Nombre de la categoría"
        onChange={(e) => setName(e.target.value)}
        value={Name}
      />
      <Button onClick={onSubmit} disabled={LoadingRequest} className="w-full">
        {LoadingRequest && <Loader2 className="animate-spin" />}
        Guardar
      </Button>
    </div>
  );
};
