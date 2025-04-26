import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { useSalesContext } from "@/Context/UseSalesContext";
import { CreateProductDTO } from "@/hooks/CatalogInterfaces";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { CheckCircle2, ChevronLeft, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ExtraDataTabProps {
  onPrevious: () => void;
  Product: CreateProductDTO;
  setProduct: React.Dispatch<React.SetStateAction<CreateProductDTO>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  createProduct: (productToCreate: CreateProductDTO) => void;
  triggerTitle: string;
}

const ExtraDataTab = ({
  onPrevious,
  Product,
  setProduct,
  loading,
  setLoading,
  createProduct,
  triggerTitle,
}: ExtraDataTabProps) => {
  const { BASE_URL } = useSalesContext();
  const { getToken } = useKindeAuth();

  const toastDefaultError = () => {
    window.alert("Ocurrió un error al cargar las imágenes");
  };

  //#green Image uploading and preview logic
  const [SelectedFiles, setSelectedFiles] = useState<Array<File>>([]);
  const [PreviewUrls, setPreviewUrls] = useState<Array<string>>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);
      // Create preview URLs
      const urls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  useEffect(() => {
    return () => {
      PreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [PreviewUrls]);

  const uploadImages = async (files: Array<File>) => {
    try {
      if (!getToken) {
        console.error("Token is undefined");
        toastDefaultError();
        return [];
      }
      const uploadPromises = files.map(async (file) => {
        const accessToken = await getToken();
        const responseUrl = await fetch(
          `${BASE_URL}/img?fileName=${file.name}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!responseUrl.ok) {
          throw new Error(
            `Failed to get presigned URL: ${responseUrl.statusText}`
          );
        }
        const uploadUrl = await responseUrl.text();
        await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });
        return uploadUrl.split("?")[0];
      });
      const uploadedUrls = await Promise.all(uploadPromises);
      return uploadedUrls;
    } catch (error) {
      console.error("Error during Image Upload: ", error);
      toastDefaultError();
      return [];
    }
  };
  //#

  //#orange Remove existing product images and preview upload images
  const removeImage = (url: string) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((image: string) => image !== url),
    }));
  };
  const removePreviewImage = (url: string) => {
    const index = PreviewUrls.indexOf(url);
    if (index !== -1) {
      URL.revokeObjectURL(url);
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };
  //#

  //#blue kickstart product creation
  const onSubmit = async () => {
    setLoading(true);
    try {
      const fileInput = SelectedFiles;
      if (fileInput && fileInput.length > 0) {
        const newUrls = await uploadImages(fileInput);
        const updatedProduct = {
          ...Product,
          images: [...(Product.images || []), ...newUrls],
        };
        createProduct(updatedProduct);
      } else {
        createProduct(Product);
      }
    } catch (error) {
      console.error("Error during Image Upload: ", error);
      toastDefaultError();
    }
  };
  //#

  return (
    <TabsContent value="extraData" className="h-full w-full">
      <div className="h-full w-full grid grid-cols-6 grid-rows-8 gap-4">
        <div className="row-start-1 row-end-8 col-start-1 col-end-4 flex flex-col justify-start">
          <section className="flex flex-col gap-4">
            <Label className="text-xl">Imágenes (Opcional)</Label>
            <Input
              type="file"
              multiple
              onChange={handleFileUpload}
              accept="image/*"
            />
          </section>
          <section className="pt-4 flex flex-row gap-2 flex-wrap">
            {Product?.images?.map((image: string, index: number) => (
              <article
                key={index}
                className="w-40 h-40 rounded-md border border-input bg-contain bg-no-repeat bg-center relative"
                style={{ backgroundImage: `url(${image})` }}
              >
                <span
                  className="p-2 absolute right-1 bottom-1 bg-destructive rounded-md cursor-pointer hover:opacity-85"
                  onClick={() => removeImage(image)}
                >
                  <Trash2 color="white" />
                </span>
              </article>
            ))}
            {PreviewUrls.map((url, index) => (
              <article
                key={index}
                className="w-40 h-40 rounded-md border border-input bg-contain bg-no-repeat bg-center relative"
                style={{ backgroundImage: `url(${url})` }}
              >
                <span
                  className="p-2 absolute right-1 bottom-1 bg-destructive rounded-md cursor-pointer hover:opacity-85"
                  onClick={() => removePreviewImage(url)}
                >
                  <Trash2 color="white" />
                </span>
              </article>
            ))}
          </section>
        </div>
        <div className="row-start-1 row-end-8 col-start-4 col-end-7 flex flex-col justify-start">
          <Label className="text-xl">Características (Opcional)</Label>
          <section className="flex flex-col justify-evenly h-full">
            <div className="flex flex-col gap-2">
              <Label className="text-md">Color</Label>
              <Input
                value={Product?.color}
                onChange={(e) =>
                  setProduct((prev) => ({ ...prev, color: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-md">Origen</Label>
              <Input
                value={Product?.origen}
                onChange={(e) =>
                  setProduct((prev) => ({ ...prev, origen: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-md">Borde</Label>
              <Input
                value={Product?.borde}
                onChange={(e) =>
                  setProduct((prev) => ({ ...prev, borde: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-md">Aspecto</Label>
              <Input
                value={Product?.aspecto}
                onChange={(e) =>
                  setProduct((prev) => ({ ...prev, aspecto: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-md">Textura</Label>
              <Input
                value={Product?.textura}
                onChange={(e) =>
                  setProduct((prev) => ({ ...prev, textura: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-md">Tránsito</Label>
              <Input
                value={Product?.transito}
                onChange={(e) =>
                  setProduct((prev) => ({ ...prev, transito: e.target.value }))
                }
              />
            </div>
          </section>
        </div>
        <div className="row-start-8 col-span-2 col-start-3 flex flex-row justify-between items-center gap-2">
          <Button
            onClick={onPrevious}
            className="gap-2 w-1/2"
            disabled={loading}
          >
            <ChevronLeft size={16} />
            Anterior
          </Button>
          <Button
            className="gap-2 w-1/2 bg-chart-2"
            disabled={loading}
            onClick={onSubmit}
          >
            {loading && <Loader2 className="animate-spin" />}
            {triggerTitle === "Nuevo Producto" ? "Crear" : "Actualizar"}
            <CheckCircle2 size={16} />
          </Button>
        </div>
      </div>
    </TabsContent>
  );
};
export default ExtraDataTab;
