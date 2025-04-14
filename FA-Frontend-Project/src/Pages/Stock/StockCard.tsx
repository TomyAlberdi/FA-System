import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { PartialProductStock } from "@/hooks/CatalogInterfaces";
import { CircleEllipsis } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const StockCard = ({ stock }: { stock: PartialProductStock }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="ProductCard relative bg-primary-foreground md:h-[400px] h-[200px] md:w-[19.2%] w-full md:max-w-[300px] md:min-w-[220px] p-2 grid md:grid-rows-9 md:grid-cols-1 grid-cols-5 grid-rows-3 cursor-pointer"
      onClick={() => navigate(`/catalog/stock/${stock?.productId}`)}
    >
      <div
        className="stockImage md:w-full row-span-5 bg-contain bg-center bg-no-repeat mr-2 md:mr-0 row-start-1 col-start-1 md:col-span-1 col-span-2" 
        style={
          stock?.productImage === "" || stock?.productImage === null
            ? {
                backgroundImage: `url(https://media.istockphoto.com/id/1147544807/es/vector/no-imagen-en-miniatura-gr%C3%A1fico-vectorial.jpg?s=612x612&w=0&k=20&c=Bb7KlSXJXh3oSDlyFjIaCiB9llfXsgS7mHFZs6qUgVk=)`,
              }
            : {
                backgroundImage: `url(${stock?.productImage})`,
              }
        }
      ></div>
      <div className="stockData w-full pl-2 flex flex-col justify-between items-center md:row-span-4 row-span-3 col-start-3 md:col-start-1 col-span-3 md:col-span-1">
        <CardTitle className="text-2xl font-semibold overflow-hidden line-clamp-2 md:h-2/4 h-1/3 w-full flex flex-row items-center justify-center text-center">
          {stock?.productName}
        </CardTitle>
        <div className="w-full bg-destructive rounded-md flex flex-row items-center justify-center py-2 text-lg text-white font-semibold md:h-1/4 mb-2">
          {stock?.quantity} {stock?.productSaleUnit}s
        </div>
        <Button
          className="w-full text-md md:h-1/4 h-1/4"
          onClick={() => navigate(`/catalog/stock/${stock?.productId}`)}
        >
          <CircleEllipsis className="bigger-icon" />
          Ver Producto
        </Button>
      </div>
    </Card>
  );
};
