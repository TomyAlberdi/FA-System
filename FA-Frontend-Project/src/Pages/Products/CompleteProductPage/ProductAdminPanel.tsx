import { Button } from "@/components/ui/button"
import { CompleteProduct } from "@/hooks/CatalogInterfaces"

export const ProductPageAdminPanel = ({ Product }: { Product: CompleteProduct | null }) => {
  return (
    <div className="adminPanel productGridItem row-start-8 row-end-16 col-start-1 col-end-5">
      Admin panel
    </div>
  )
}