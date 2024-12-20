import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PartialProductStock } from "@/hooks/CatalogInterfaces";
import { CircleEllipsis } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const StockCard = ({ stock }: { stock: PartialProductStock }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="ProductCard relative bg-primary-foreground h-[200px] w-[24.2%] max-w-[400px] min-w-[300px] p-2 cursor-pointer flex flex-row items-center justify-start"
      onClick={() => navigate(`/catalog/stock/${stock?.productId}`)}
    >
      <div className="stockImage h-[182px] w-[182px] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${stock?.productImage})` }}></div>
      <div className="stockData h-full w-1/2 pl-2 flex flex-col justify-between items-start">
        <Tooltip>
          <TooltipTrigger asChild>
          <CardTitle className="text-xl font-semibold overflow-hidden line-clamp-2">
          {stock?.productName}
        </CardTitle>
          </TooltipTrigger>
          <TooltipContent>
            {stock?.productName}
          </TooltipContent>
        </Tooltip>
          <div className="w-full bg-destructive rounded-md flex flex-row items-center justify-center py-2 text-lg text-white font-semibold">
            {stock?.quantity} {stock?.productSaleUnit}s
          </div>
        <Button className="w-full text-md" onClick={() => navigate(`/catalog/stock/${stock?.productId}`)}>
          <CircleEllipsis className="bigger-icon" />
          Ver Producto
        </Button>
      </div>
    </Card>
  );
};
