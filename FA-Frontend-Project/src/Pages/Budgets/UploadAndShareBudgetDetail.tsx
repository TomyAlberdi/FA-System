import { Button } from "@/components/ui/button";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import jsPDF from "jspdf";
import { Share2 } from "lucide-react";
import { useEffect, useState } from "react";

const UploadAndShareBudgetDetail = ({
  budgetId,
  budgetDetail,
}: {
  budgetId: number;
  budgetDetail: jsPDF | null;
}) => {
  const { getToken } = useKindeAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [pdfUrl, setpdfUrl] = useState<string | null>(null);
  const [Loading, setLoading] = useState(false);

  const uploadPdf = async () => {
    if (!getToken) {
      console.error("Token is undefined");
      window.alert("Error: No se pudo autenticar la solicitud");
      return;
    }
    setLoading(true);
    try {
      const accessToken = await getToken();
      const urlResponse = await fetch(
        `${BASE_URL}/img?fileName=Budget_${budgetId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!urlResponse.ok) {
        throw new Error(
          `Error: ${urlResponse.status} ${urlResponse.statusText}`
        );
      }
      const uploadUrl = await urlResponse.text();
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: budgetDetail?.output("blob"),
        headers: { "Content-Type": "application/pdf" },
      });
      if (!uploadResponse.ok) {
        throw new Error(
          `Error: ${uploadResponse.status} ${uploadResponse.statusText}`
        );
      }
      setpdfUrl(uploadUrl.split("?")[0]);
    } catch (error) {
      console.error("Error during image upload:", error);
      window.alert("Error al subir las imágenes");
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pdfUrl && !Loading) {
      navigator.clipboard.writeText(pdfUrl);
      window.alert("Link del PDF copiado.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfUrl]);

  return (
    <Button className="w-full" onClick={uploadPdf} disabled={Loading}>
      <Share2 />
      Compartir PDF Link
    </Button>
  );
};
export default UploadAndShareBudgetDetail;
