import { SalesContext, SalesContextType } from "@/Context/SalesContext";

interface SalesContextComponentProps {
  children: React.ReactNode;
}

const SalesContextComponent: React.FC<SalesContextComponentProps> = ({ children }) => {
  //const { toast } = useToast();
  //const { getToken } = useKindeAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  

  const exportData: SalesContextType = {
    BASE_URL,
  };

  return (
    <SalesContext.Provider value={exportData}>
      {children}
    </SalesContext.Provider>
  );

}

export default SalesContextComponent;