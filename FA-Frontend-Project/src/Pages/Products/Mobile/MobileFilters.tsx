import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Menu } from "lucide-react"

const MobileFilters = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild className="flex md:hidden">
        <Button>
          <Menu className="large-icon" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          test
        </div>
      </DrawerContent>
    </Drawer>
  )
}
export default MobileFilters