import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { CardProduct } from "@/hooks/CatalogInterfaces";
import { CirclePlus } from "lucide-react";

export const ProductCard = ({ product }: { product: CardProduct }) => {
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
        <Button className="w-full h-full">
          <CirclePlus />
          Añadir
        </Button>
      </div>
    </Card>
  );
};
