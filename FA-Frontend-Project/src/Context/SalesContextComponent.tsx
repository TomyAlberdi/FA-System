import { SalesContext, SalesContextType } from "@/Context/SalesContext";
import { CompleteClient } from "@/hooks/SalesInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

interface SalesContextComponentProps {
  children: React.ReactNode;
}

const SalesContextComponent: React.FC<SalesContextComponentProps> = ({
  children,
}) => {
  const { getToken } = useKindeAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

/*   useEffect(() => {
    const fetchData = async () => {
      if (getToken) {
        const accessToken = await getToken();
        if (accessToken) {
          fetchClients();
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken]); */

  /// CLIENT GET ///

  const fetchClient = async (id: number) => {
    try {
      if (!getToken) {
        console.error("getToken is undefined");
        return;
      }
      const accessToken = await getToken();
      const response = await fetch(`${BASE_URL}/clients/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        console.error("Error fetching data: ", response.statusText);
        return;
      }
      const result: CompleteClient = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const exportData: SalesContextType = {
    BASE_URL,
    fetchClient,
  };

  return (
    <SalesContext.Provider value={exportData}>{children}</SalesContext.Provider>
  );
};

export default SalesContextComponent;
