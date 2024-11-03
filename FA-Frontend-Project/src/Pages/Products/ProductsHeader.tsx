import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { CirclePlus } from "lucide-react"
import { useState } from "react"

export const ProductsHeader = () => {

  const [Open, setOpen] = useState(false)

  return (
    <section className="listHeader">
      <span></span>
      <Dialog open={Open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button className="text-lg">
            <CirclePlus />
            Nuevo Producto
          </Button>
        </DialogTrigger>
      </Dialog>
    </section>
  )
}