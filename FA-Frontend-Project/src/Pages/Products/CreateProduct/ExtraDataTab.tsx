import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { CreateProductDTO } from "@/hooks/CatalogInterfaces";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

interface ExtraDataTabProps {
  onPrevious: () => void;
  Product: CreateProductDTO;
  setProduct: React.Dispatch<React.SetStateAction<CreateProductDTO>>;
}

const ExtraDataTab = ({
  onPrevious,
  Product,
  setProduct,
}: ExtraDataTabProps) => {
  return (
    <TabsContent value="extraData" className="h-full w-full">
      <div className="h-full w-full grid grid-cols-6 grid-rows-8 gap-4">
        
        <div className="row-start-8 col-span-2 col-start-3 flex flex-row justify-between items-center gap-2">
          <Button onClick={onPrevious} className="gap-2 w-1/2">
            <ChevronLeft size={16} />
            Anterior
          </Button>
          <Button
            className="gap-2 w-1/2 bg-chart-2"
            // disabled={DisableComplete}
          >
            Crear
            <CheckCircle2 size={16} />
          </Button>
        </div>
      </div>
    </TabsContent>
  );
};
export default ExtraDataTab;
