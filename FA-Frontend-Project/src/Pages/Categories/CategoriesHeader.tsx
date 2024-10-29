import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useState } from "react";
import { useCatalogContext } from "@/Context/UseCatalogContext";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe contar con al menos 3 caracteres.",
  }),
});

interface Category {
  id: number;
  name: string;
  productsAmount: number;
}

export const CategoriesHeader = () => {
  const [open, setOpen] = useState(false);

  const { BASE_URL } = useCatalogContext();

  const { getToken } = useKindeAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (typeof getToken === "function") {
      const token = await getToken();
      console.log(token);
      try {
        const response = await fetch(`${BASE_URL}/category/${data.name}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          console.error("Error: ", response.statusText);
          return;
        }
        const result: Category = await response.json();
        console.log(result);
      } catch (error) {
        console.error("Error: ", error);
      } finally {
        setOpen(false);
      }
    } else return;
  }

  return (
    <section className="listHeader">
      <h1 className="sectionTitle">Categorías</h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="text-lg">
            <CirclePlus />
            Añadir Categoría
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[500px] w-full"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Añadir Categoría
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de la categoría" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Guardar</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </section>
  );
};
