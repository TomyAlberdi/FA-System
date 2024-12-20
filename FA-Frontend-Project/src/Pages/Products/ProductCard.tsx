import { CardProduct } from "@/hooks/CatalogInterfaces";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SquarePlus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

export const ProductCard = ({ product }: { product: CardProduct }) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/catalog/products/${product.id}`)}
      className={
        "ProductCard relative bg-primary-foreground h-[400px] w-[19.2%] max-w-[300px] min-w-[225px] p-2 grid grid-cols-1 grid-rows-9 cursor-pointer" +
        (product.disabled ? " opacity-50 border-red-700" : "")
      }
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <CardTitle className="row-span-1 truncate overflow-hidden whitespace-nowrap pt-1">
            {product.name}
          </CardTitle>
        </TooltipTrigger>
        <TooltipContent>{product.name}</TooltipContent>
      </Tooltip>
      {product.discountPercentage > 0 && (
        <div className="discountTag absolute right-0 bg-destructive py-1 px-2 rounded-l-md text-lg font-medium shadow-md text-white">
          - {product.discountPercentage}%
        </div>
      )}
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
      <CardTitle className="w-full row-span-2 flex flex-col justify-center items-center overflow-hidden">
        {product.discountPercentage > 0 ? (
          <>
            <span className="oldPrice line-through mr-1 text-xl text-muted-foreground">
              $ {product?.measurePrice}
            </span>
            <span className="newPrice text-destructive overflow-hidden">
              $ {product?.discountedMeasurePrice} X {product.measureType}
            </span>
          </>
        ) : (
          <>
            $ {product?.measurePrice} X {product.measureType}
          </>
        )}
        {product?.measureType !== product?.saleUnit && (
          <CardDescription className="w-full text-center text-base overflow-hidden">
            {product.discountPercentage > 0 ? (
              <>
                $ {product?.discountedPrice} X {product.saleUnit} (
                {product.measurePerSaleUnit} m2)
              </>
            ) : (
              <>
                $ {product?.saleUnitPrice} X {product.saleUnit} (
                {product.measurePerSaleUnit} {product.measureType})
              </>
            )}
          </CardDescription>
        )}
      </CardTitle>
      <Button
        className={
          "w-full row-span-1 text-center row-start-9" +
          (product.disabled ? " bg-red-700" : "")
        }
      >
        <SquarePlus />
        Ver más
      </Button>
    </Card>
  );
};
