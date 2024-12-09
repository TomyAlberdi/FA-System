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
import { Slider } from "@/components/ui/slider";
import { useCatalogContext } from "@/Context/UseCatalogContext";
import { Provider as ProviderIntefrace } from "@/hooks/CatalogInterfaces";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { CirclePercent, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  id: z.number(),
  percentage: z.number().min(0).max(100),
});

export const UpdateDiscountProvider = ({
  provider,
  setReload,
  Reload,
}: {
  provider: ProviderIntefrace | null;
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
      percentage: provider?.productsDiscount,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const updateDiscount = async (data: z.infer<typeof formSchema>) => {
    setLoadingRequest(true);
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      let url;
      if (
        provider?.productsDiscount &&
        data.percentage < provider?.productsDiscount
      ) {
        url = `${BASE_URL}/product/removeDiscountByProvider?providerId=${provider?.id}&percentage=${data.percentage}`;
      } else {
        url = `${BASE_URL}/product/applyDiscountByProvider?providerId=${provider?.id}&percentage=${data.percentage}`;
      }
      const response = await fetch(url, {
        method: "PUT",
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
          description: `Ocurrió un error al actualizar el descuento.`,
        });
        return;
      }
      toast({
        title: "Precio actualizado",
        description: "El descuento ha sido actualizado con éxito",
      });
    } catch (error) {
      console.error("Error: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al actualizar el descuento",
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
          <CirclePercent />
          Modificar Descuentos
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
            onSubmit={form.handleSubmit(updateDiscount)}
            className="w-full space-y-6"
          >
            <FormDescription>
              Agregar o quitar un descuento temporal a todos los productos de{" "}
              {provider?.name}
            </FormDescription>
            <FormField
              control={form.control}
              name="percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Modificar descuento:
                    <span className="px-2 text-lg font-semibold">
                      %{field.value || 0}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
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
