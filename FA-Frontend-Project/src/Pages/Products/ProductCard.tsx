import { CardProduct } from "@/hooks/CatalogInterfaces";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ProductCard = ({ product }: { product: CardProduct }) => {
  return (
    <Card className="h-[400px] w-[24.25%] max-w-[400px] p-2 grid grid-cols-1 grid-rows-10 cursor-pointer">
      <CardTitle className="row-span-1 truncate overflow-hidden whitespace-nowrap pt-1">
        {product.name}
      </CardTitle>
      <div
        className="image w-full row-span-5 mb-1"
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
      <CardTitle className="w-full row-span-1 text-center text-destructive">
        $ {product.saleUnitPrice / product.measurePerSaleUnit} X {product.measureType}
      </CardTitle>
      {
        product.measureType === "M2" ? (
          <CardDescription className="w-full row-span-1 text-center text-xl">
            $ {product.saleUnitPrice} X {product.saleUnit} ({product.measurePerSaleUnit} m2)
          </CardDescription>
        ) : null
      }
    </Card>
  );
};
