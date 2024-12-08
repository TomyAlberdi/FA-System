import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { DollarSign, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Provider as ProviderInterface } from "@/hooks/CatalogInterfaces";
import { Slider } from "@/components/ui/slider";

const formSchema = z.object({
  id: z.number(),
  percentage: z.number().min(-50).max(100),
});

export const UpdatePriceProvider = ({
  provider,
  Reload,
  setReload,
}: {
  provider: ProviderInterface | null;
  Reload: boolean;
  setReload: (value: boolean) => void;
}) => {
  const [LoadingRequest, setLoadingRequest] = useState(false);
  const [Open, setOpen] = useState(false);
  const { BASE_URL } = useCatalogContext();
  const { toast } = useToast();
  const { getToken } = useKindeAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    form.reset({
      id: provider?.id,
      percentage: 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const updatePrice = async (data: z.infer<typeof formSchema>) => {
    setLoadingRequest(true);
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      if (data.percentage > 0) {
        const response = await fetch(
          `${BASE_URL}/product/increasePriceByProvider?providerId=${provider?.id}&percentage=${data.percentage}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          console.error("Error: ", response.statusText);
          toast({
            variant: "destructive",
            title: `Error ${response.status}`,
            description: `Ocurrió un error al actualizar el precio.`,
          });
          return;
        }
        toast({
          title: "Precio actualizado",
          description: "El precio ha sido actualizado con éxito",
        });
      } else {
        const response = await fetch(
          `${BASE_URL}/product/reducePriceByProvider?providerId=${
            provider?.id
          }&percentage=${data.percentage * -1}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          console.error("Error: ", response.statusText);
          toast({
            variant: "destructive",
            title: `Error ${response.status}`,
            description: `Ocurrió un error al actualizar el precio.`,
          });
          return;
        }
        toast({
          title: "Precio actualizado",
          description: "El precio ha sido actualizado con éxito",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al actualizar el precio",
      });
    } finally {
      form.resetField("percentage");
      setLoadingRequest(false);
      setReload(!Reload);
      setOpen(false);
    }
  };

  return (
    <Dialog open={Open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mb-2">
          <DollarSign />
          Modificar Precios
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[500px] w-full"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Administrar</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(updatePrice)}
            className="w-full space-y-6"
          >
            <FormDescription>
              Modificar permanentemente el precio de todos los productos de{" "}
              {provider?.name}
            </FormDescription>
            <FormField
              control={form.control}
              name="percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Modificar precio:
                    <span className="px-2 text-lg font-semibold">
                      %{field.value || 0}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={-50}
                      max={50}
                      step={1}
                      value={[field.value || 0]}
                      onValueChange={(values) => field.onChange(values[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button>
              {LoadingRequest && <Loader2 className="animate-spin" />}
              Confirmar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
