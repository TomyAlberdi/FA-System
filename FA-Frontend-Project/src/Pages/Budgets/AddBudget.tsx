import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSalesContext } from "@/Context/UseSalesContext";
import { PartialClient } from "@/hooks/SalesInterfaces";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CirclePlus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FloatingProductPagination } from "@/Pages/Budgets/FloatingProductPagination";

const formSchema = z.object({
  clientId: z.number(),
  products: z
    .array(
      z.object({
        id: z.number(),
        productCode: z.string(),
        productIdentification: z.string(),
        productQuantity: z.string(),
        productMeasures: z.string(),
        productMeasurePrice: z.number(),
        measureUnitQuantity: z.number(),
        saleUnitQuantity: z.number(),
        subtotal: z.number(),
        productSaleUnit: z.string(),
        productMeasureUnit: z.string(),
        saleUnitPrice: z.number(),
      })
    )
    .optional(),
});

export const AddBudget = () => {
  const { fetchListOfClients } = useSalesContext();
  const { toast } = useToast();

  // Form logic
  const [LoadingRequest, setLoadingRequest] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      products: [],
    },
  });
  const submitBudget = async (data: z.infer<typeof formSchema>) => {
    setLoadingRequest(true);
    if (data.products?.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El presupuesto no tiene productos asociados.",
      });
      setLoadingRequest(false);
      return;
    }
    console.log(data);
  };

  // Client list for selection
  const [Clients, setClients] = useState<Array<PartialClient> | undefined>([]);
  useEffect(() => {
    fetchListOfClients()
      .then((result) => {
        setClients(result);
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al obtener los clientes.",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Current date
  const date = new Date();
  const formattedDate = date.toISOString().split("T")[0]; // 'YYYY-MM-DD'

  // Final Amount calculation
  const [FinalAmount, setFinalAmount] = useState(0);
  useEffect(() => {
    let total = 0;
    form.watch("products")?.forEach((product) => {
      const amountOfProducts = product.saleUnitQuantity;
      const saleUnitPrice = product.saleUnitPrice;
      if (product.measureUnitQuantity > 0) {
        const subtotal =
          Math.round(
            (amountOfProducts * saleUnitPrice + Number.EPSILON) * 100
          ) / 100;
        product.subtotal = subtotal;
      }
      if (product.subtotal > 0) {
        total += product.subtotal;
      }
    });
    setFinalAmount(total);
  }, [form]);

  // Product list for selection
  const [OpenProductPagination, setOpenProductPagination] = useState(false);

  return (
    <div>
      <h1 className="sectionTitle">Crear Presupuesto</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitBudget)}
          className="w-full grid grid-cols-3 grid-rows-6 gap-4 px-5 pt-2 h-[calc(100svh-9rem)]"
        >
          <Card className="col-start-1 row-start-1 row-span-2">
            <CardHeader>
              <CardTitle>Información del Presupuesto</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-lg">Cliente:</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" role="combobox">
                            {field.value
                              ? Clients?.find(
                                  (client: PartialClient) =>
                                    client.id === field.value
                                )?.name
                              : "Seleccionar cliente"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandInput placeholder="Buscar cliente" />
                          <CommandList>
                            <CommandEmpty>
                              No hay clientes disponibles.
                            </CommandEmpty>
                            <CommandGroup>
                              {Clients?.map(
                                (client: PartialClient, index: number) => (
                                  <CommandItem
                                    value={client.name}
                                    key={index}
                                    onSelect={() => {
                                      form.setValue("clientId", client.id);
                                    }}
                                  >
                                    {client.name}
                                    <Separator orientation="vertical" />
                                    <span className="text-sm ml-auto">
                                      {client.type}
                                    </span>
                                  </CommandItem>
                                )
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardContent className="flex flex-row justify-evenly">
              <div>
                <Label className="text-lg">Fecha de emisión:</Label>
                <br />
                <span className="text-xl font-semibold">{formattedDate}</span>
              </div>
              <div>
                <Label className="text-lg">Monto final:</Label>
                <br />
                <span className="text-xl font-semibold">$ {FinalAmount}</span>
              </div>
            </CardContent>
          </Card>
          <div className="buttonDiv col-start-1 row-start-3 row-span-1">
            <Button type="submit" className="w-full" disabled={LoadingRequest}>
              {LoadingRequest && <Loader2 className="animate-spin" />}
              Crear Presupuesto
            </Button>
          </div>
          <ScrollArea className="col-start-2 col-span-2 row-start-1 row-span-6 flex flex-col items-center justify-center">
            <Label className="text-2xl">Productos</Label>
            {form.watch("products")?.length === 0 ? (
              <Alert variant="destructive" className="w-full mt-2">
                <AlertCircle className="w-5 pt-1" />
                <AlertTitle className="text-xl">Vacío</AlertTitle>
                <AlertDescription className="text-lg">
                  El presupuesto no tiene productos asociados.
                </AlertDescription>
              </Alert>
            ) : (
              <span>tiene</span>
            )}
            <Dialog
              open={OpenProductPagination}
              onOpenChange={setOpenProductPagination}
            >
              <DialogTrigger asChild>
                <Button className="w-2/6 mt-2">
                  <CirclePlus />
                  Añadir producto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[80vw] w-full max-h-[90vh] h-full flex flex-col">
                <DialogTitle className="text-xl font-bold">
                  Añadir Producto
                </DialogTitle>
                <FloatingProductPagination setOpen={setOpenProductPagination} />
              </DialogContent>
            </Dialog>
          </ScrollArea>
        </form>
      </Form>
    </div>
  );
};
