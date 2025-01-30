import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { PartialProductStock } from "@/hooks/CatalogInterfaces";
import { CircleEllipsis } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const StockCard = ({ stock }: { stock: PartialProductStock }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="ProductCard relative bg-primary-foreground h-[400px] w-[19.2%] max-w-[300px] min-w-[220px] p-2 grid grid-rows-9 cursor-pointer"
      onClick={() => navigate(`/catalog/stock/${stock?.productId}`)}
    >
      <div
        className="stockImage w-full row-span-5 bg-contain bg-center bg-no-repeat"
        style={
          stock?.productImage === "" || stock?.productImage === null
            ? {
                backgroundImage: `url(https://media.istockphoto.com/id/1147544807/es/vector/no-imagen-en-miniatura-gr%C3%A1fico-vectorial.jpg?s=612x612&w=0&k=20&c=Bb7KlSXJXh3oSDlyFjIaCiB9llfXsgS7mHFZs6qUgVk=)`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : {
                backgroundImage: `url(${stock?.productImage})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
        }
      ></div>
      <div className="stockData w-full pl-2 flex flex-col justify-between items-center row-span-4">
        <CardTitle className="text-2xl font-semibold overflow-hidden line-clamp-2 h-2/4 w-full flex flex-row items-center justify-center text-center">
          {stock?.productName}
        </CardTitle>
        <div className="w-full bg-destructive rounded-md flex flex-row items-center justify-center py-2 text-lg text-white font-semibold h-1/4 mb-2">
          {stock?.quantity} {stock?.productSaleUnit}s
        </div>
        <Button
          className="w-full text-md h-1/4"
          onClick={() => navigate(`/catalog/stock/${stock?.productId}`)}
        >
          <CircleEllipsis className="bigger-icon" />
          Ver Producto
        </Button>
      </div>
    </Card>
  );
};
