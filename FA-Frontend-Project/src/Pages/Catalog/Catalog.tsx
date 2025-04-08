import { LastStockRecords } from "@/Pages/Catalog/charts/LastStockRecords"
import { StockRecordsByMonth } from "@/Pages/Catalog/charts/StockRecordsByMonth"
import { AdminPanel } from "@/Pages/Catalog/AdminPanel"

export const Catalog = () => {
  return (
    <div className="Catalog ProductPage flex flex-col h-full w-full md:grid">
      <StockRecordsByMonth />
      <LastStockRecords />
      <AdminPanel />
    </div>
  )
}