import { ProductsByCategory } from "@/Pages/Catalog/charts/ProductsByCategory"
import { ProductsByProvider } from "@/Pages/Catalog/charts/ProductsByProvider"
import { LastStockRecords } from "@/Pages/Catalog/charts/LastStockRecords"

export const Catalog = () => {
  return (
    <div className="Catalog ProductPage h-full w-full">
      <ProductsByCategory />
      <ProductsByProvider />
      <LastStockRecords />
    </div>
  )
}