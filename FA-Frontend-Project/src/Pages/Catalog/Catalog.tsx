import { ProductsByCategory } from "@/Pages/Catalog/charts/ProductsByCategory"
import { ProductsByProvider } from "@/Pages/Catalog/charts/ProductsByProvider"

export const Catalog = () => {
  return (
    <div className="Catalog ProductPage h-full w-full">
      <ProductsByCategory />
      <ProductsByProvider />
    </div>
  )
}