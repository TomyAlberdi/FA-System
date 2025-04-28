import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCatalogContext } from "@/Context/UseCatalogContext";
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
  const navigate = useNavigate();

  const [Name, setName] = useState<string>("");

  const onSubmit = () => {
    if (Name === "") {
      window.alert("El nombre de la categoría no puede estar vacío.");
      return;
    }
    submitCategory(Name);
  };

  const submitCategory = async (name: string) => {
    setLoadingRequest(true);
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        setLoadingRequest(false);
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/category/${name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error: ", response.statusText);
        window.alert(`Error creando la categoría: ${response.status}`);
        return;
      }
      const responseData = await response.json();
      setOpen(false);
      window.alert("Categoría creada con éxito");
      await fetchCategories();
      navigate(`/catalog/categories/${responseData.id}`);
    } catch (error) {
      console.error("Error: ", error);
      window.alert("Ocurrió un error al crear la categoría");
    } finally {
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
