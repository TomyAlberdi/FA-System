import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardProduct } from "@/hooks/CatalogInterfaces";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  saleUnitQuantity: z.string(),
});

export const ProductCard = ({
  product,
  handleAddProduct,
}: {
  product: CardProduct;
  handleAddProduct: (
    product: CardProduct,
    measureUnitQuantity: number,
    saleUnitQuantity: number,
    subtotal: number
  ) => void;
}) => {
  const [Open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      saleUnitQuantity: "0",
    },
  });

  const addProductToBudget = (data: z.infer<typeof formSchema>) => {
    if (data.saleUnitQuantity === "0") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La cantidad de unidades no puede ser 0.",
      });
      return;
    }
    const measureUnitQuantity =
      Math.round(
        (parseFloat(data.saleUnitQuantity) * product.measurePerSaleUnit +
          Number.EPSILON) *
          100
      ) / 100;
    const subtotal =
      Math.round(
        (parseFloat(data.saleUnitQuantity) * product.saleUnitPrice +
          Number.EPSILON) *
          100
      ) / 100;
    handleAddProduct(
      product,
      measureUnitQuantity,
      parseFloat(data.saleUnitQuantity),
      subtotal
    );
    setOpen(false);
  };

  return (
    <Card className="w-[19.2%] h-[350px] p-2 grid grid-cols-1 grid-rows-8">
      <CardTitle className="row-span-1 truncate overflow-hidden whitespace-nowrap">
        {product.name}
      </CardTitle>
      <div
        className="row-span-5"
        style={
          product.image === "" || product.image === null
            ? {
                backgroundImage: `url(https://media.istockphoto.com/id/1147544807/es/vector/no-imagen-en-miniatura-gr%C3%A1fico-vectorial.jpg?s=612x612&w=0&k=20&c=Bb7KlSXJXh3oSDlyFjIaCiB9llfXsgS7mHFZs6qUgVk=)`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : {
                backgroundImage: `url(${product.image})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
        }
      />
      <div className="row-span-1" />
      <div className="row-span-1">
        <Dialog open={Open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full h-full">
              <CirclePlus />
              Añadir
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[500px] w-full"
            aria-describedby={undefined}
          >
            <DialogTitle className="text-xl font-bold">
              Añadir {product.name} al presupuesto
            </DialogTitle>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(addProductToBudget)}>
                <FormField
                  control={form.control}
                  name="saleUnitQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">
                        Cantidad de unidades ({product.saleUnit})
                      </FormLabel>
                      <Input type="number" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem className="mt-2">
                  <FormLabel className="text-lg">
                    Equivale a:
                    <span className="text-xl font-semibold px-2">
                      {Math.round(
                        (parseFloat(form.watch("saleUnitQuantity")) *
                          product.measurePerSaleUnit +
                          Number.EPSILON) *
                          100
                      ) / 100}
                      {product.measureType}
                    </span>
                  </FormLabel>
                </FormItem>
                <FormItem className="my-3">
                  <FormLabel className="text-lg">
                    Subtotal:
                    <span className="text-xl font-semibold px-2">
                      ${" "}
                      {Math.round(
                        (parseFloat(form.watch("saleUnitQuantity")) *
                          product.saleUnitPrice +
                          Number.EPSILON) *
                          100
                      ) / 100}
                    </span>
                  </FormLabel>
                </FormItem>
                <Button type="submit" className="w-full">
                  <CirclePlus />
                  Agregar al presupuesto
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};
