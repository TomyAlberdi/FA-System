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
        "ProductCard relative bg-primary-foreground h-[200px] w-full grid-cols-5 grid-rows-5 md:h-[400px] md:w-[24.2%] md:max-w-[300px] md:min-w-[220px] p-2 grid md:grid-cols-1 md:grid-rows-9 cursor-pointer" +
        (product.disabled ? " opacity-50 border-red-700" : "")
      }
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <CardTitle className="row-span-1 col-start-3 md:col-start-1 col-span-3 md:col-span-1 truncate overflow-hidden whitespace-nowrap pt-1 text-center">
            {product.name}
          </CardTitle>
        </TooltipTrigger>
        <TooltipContent>{product.name}</TooltipContent>
      </Tooltip>
      {product.discountPercentage > 0 && (
        <div className="absolute top-2 md:top-[15%] left-0 md:left-auto md:right-0 bg-destructive py-1 px-2 rounded-r-md md:rounded-r-none md:rounded-l-md text-lg font-medium shadow-md text-white">
          - {product.discountPercentage}%
        </div>
      )}
      <div
        className="image md:w-full md:mb-1 md:mr-0 md:row-start-2 col-start-1 md:col-span-1 row-start-1 row-span-5 col-span-2 mr-2 bg-contain bg-center bg-no-repeat"
        style={
          product.image === "" || product.image === null
            ? {
                backgroundImage: `url(https://media.istockphoto.com/id/1147544807/es/vector/no-imagen-en-miniatura-gr%C3%A1fico-vectorial.jpg?s=612x612&w=0&k=20&c=Bb7KlSXJXh3oSDlyFjIaCiB9llfXsgS7mHFZs6qUgVk=)`,
              }
            : {
                backgroundImage: `url(${product.image})`,
              }
        }
      />
      <CardTitle className="w-full md:row-span-2 md:row-start-auto row-start-2 row-span-4 md:col-start-1 md:col-span-auto col-start-3 col-span-3 flex flex-col justify-center items-center overflow-hidden">
        {product.discountPercentage > 0 ? (
          <>
            <span className="oldPrice line-through mr-1 md:text-xl text-lg text-muted-foreground"> 
              $ {product?.measurePrice}
            </span>
            <span className="newPrice md:text-xl text-lg text-destructive overflow-hidden">
              $ {product?.discountedMeasurePrice} X {product.measureType}
            </span>
          </>
        ) : (
          <span className="md:text-xl text-lg">
            $ {product?.measurePrice} X {product.measureType}
          </span>
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
          "w-full row-span-1 md:row-start-9 row-start-5 col-span-full text-center row-start-9" +
          (product.disabled ? " bg-red-700" : "")
        }
      >
        <SquarePlus />
        Ver más
      </Button>
    </Card>
  );
};
