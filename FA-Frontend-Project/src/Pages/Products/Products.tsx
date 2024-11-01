import { ProductFilters } from "@/Pages/Products/ProductFilters"
import { ProductPagination } from "@/Pages/Products/ProductPagination"

export const Products = () => {
  return (
    <div className="Products grid grid-cols-8 gap-4">
      <ProductFilters />
      <ProductPagination />
    </div>
  )
}