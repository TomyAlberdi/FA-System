import { LastStockRecords } from "@/Pages/Catalog/charts/LastStockRecords"
import { StockRecordsByMonth } from "@/Pages/Catalog/charts/StockRecordsByMonth"

export const Catalog = () => {
  return (
    <div className="Catalog ProductPage h-full w-full">
      <StockRecordsByMonth />
      <LastStockRecords />
    </div>
  )
}