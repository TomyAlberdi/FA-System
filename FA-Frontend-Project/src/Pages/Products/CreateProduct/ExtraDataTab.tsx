import { TabsContent } from "@/components/ui/tabs";

interface ExtraDataTabProps {
  onNext: () => void;
}

const ExtraDataTab = ({ onNext }: ExtraDataTabProps) => {
  return (
    <TabsContent value="extraData" className="h-[91%] w-full">
      Extra data
    </TabsContent>
  );
};
export default ExtraDataTab;
