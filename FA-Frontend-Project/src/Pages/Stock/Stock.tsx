import { useCatalogContext } from "@/Context/UseCatalogContext"
import { ProductStock } from "@/hooks/CatalogInterfaces"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export const Stock = () => {

  const { id } = useParams()
  const { fetchProductStock } = useCatalogContext()

  const [loading, setLoading] = useState(true)
  const [stock, setStock] = useState<ProductStock | null>(null)

  useEffect(() => {
    if (id) {
      setLoading(true)
      fetchProductStock(Number.parseInt(id))
        .then((result) => setStock(result ?? null))
        .finally(() => setLoading(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <div className="ProductStock">
      stock of {stock?.productName}
    </div>
  )
}