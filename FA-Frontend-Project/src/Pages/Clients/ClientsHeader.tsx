import { ClientsFilter } from "@/hooks/SalesInterfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AddClient } from "@/Pages/Clients/AddClient";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const formSchema = z.object({
  keyword: z.string(),
  type: z.string(),
});

export const ClientsHeader = ({
  setFilters,
  handleRefresh,
}: {
  setFilters: React.Dispatch<React.SetStateAction<ClientsFilter>>;
  handleRefresh: () => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: "",
      type: "",
    },
  });

  async function obSumbit(data: z.infer<typeof formSchema>) {
    setFilters(data);
    form.reset();
  }

  const [Open, setOpen] = useState(false);

  return (
    <section className="flex listHeader">
      <h1 className="sectionTitle text-3xl">Clientes</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(obSumbit)}
          className="flex flex-row items-start justify-start gap-2 w-1/2"
        >
          <FormField
            control={form.control}
            name="keyword"
            render={({ field }) => (
              <Input
                placeholder="Buscar por nombre, DNI o CUIT"
                type="text"
                className="w-1/2 text-lg"
                {...field}
              />
            )}
          />
          <Button type="submit" className="w-10">
            <Search className="bigger-icon" />
          </Button>
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start justify-start">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="A" id="A" />
                      <Label htmlFor="A">Responsable Inscripto (Tipo A)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="B" id="B" />
                      <Label htmlFor="B">Consumidor Final (Tipo B)</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Dialog open={Open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="text-lg">
            <CirclePlus />
            Nuevo Cliente
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[500px] w-full p-6"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Añadir Cliente
            </DialogTitle>
          </DialogHeader>
          <AddClient handleRefresh={handleRefresh} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </section>
  );
};
