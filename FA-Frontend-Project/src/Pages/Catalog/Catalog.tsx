import { LastStockRecords } from "@/Pages/Catalog/charts/LastStockRecords"
import { StockRecordsByMonth } from "@/Pages/Catalog/charts/StockRecordsByMonth"
import { AdminPanel } from "@/Pages/Catalog/AdminPanel"

export const Catalog = () => {
  return (
    <div className="Catalog ProductPage h-full w-full">
      <StockRecordsByMonth />
      <LastStockRecords />
      <AdminPanel />
    </div>
  )
}