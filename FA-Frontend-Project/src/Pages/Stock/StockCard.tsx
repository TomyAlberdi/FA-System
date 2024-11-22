import { Card } from "@/components/ui/card"
import { PartialProductStock } from "@/hooks/CatalogInterfaces"

export const StockCard = ({ stock}: {stock: PartialProductStock}) => {
  return (
    <Card>
      stock
      {stock?.productName}
    </Card>
  )
}