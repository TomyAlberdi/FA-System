import { TabsContent } from "@/components/ui/tabs";

interface SaleDataTabProps {
  onNext: () => void;
}

const SaleDataTab = ({ onNext }: SaleDataTabProps) => {
  return (
    <TabsContent value="saleData" className="h-[91%] w-full">
      sale data
    </TabsContent>
  );
};
export default SaleDataTab;
