import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateProductDTO } from "@/hooks/CatalogInterfaces";
// removed getToken usage
import { CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ExtraDataTabProps {
  Product: CreateProductDTO;
  setProduct: React.Dispatch<React.SetStateAction<CreateProductDTO>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  createProduct: (newProduct: CreateProductDTO) => void;
}

const ExtraDataTab = ({
  Product,
  setProduct,
  loading,
  setLoading,
  createProduct,
}: ExtraDataTabProps) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Image uploading and preview logic
  const [uploadState, setUploadState] = useState({
    selectedFiles: [] as File[],
    previewUrls: [] as string[],
    isUploading: false,
  });
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || loading) return;
    uploadState.previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setTimeout(() => {
      const files = Array.from(event.target.files!);
      const urls = files.map((file) => URL.createObjectURL(file));
      setUploadState((prev) => ({
        ...prev,
        selectedFiles: files,
        previewUrls: urls,
      }));
    }, 100);
  };

  const uploadImages = async (files: Array<File>): Promise<string[]> => {
    setUploadState((prev) => ({ ...prev, isUploading: true }));
    try {
      const uploadPromises = files.map(async (file) => {
        const urlResponse = await fetch(`${BASE_URL}/img?fileName=${file.name}`);
        if (!urlResponse.ok) {
          throw new Error(`Error obteniendo URL: ${urlResponse.status}`);
        }
        const uploadUrl = await urlResponse.text();
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });
        if (!uploadResponse.ok) {
          throw new Error(`Error subiendo archivo: ${uploadResponse.status}`);
        }
        return uploadUrl.split("?")[0];
      });
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error during image upload:", error);
      window.alert("Error al subir las imágenes");
      return [];
    } finally {
      setUploadState((prev) => ({ ...prev, isUploading: false }));
    }
  };

  // Remove existing product images and preview upload images
  const removeImage = (url: string) => {
    setTimeout(() => {
      setProduct((prev) => ({
        ...prev,
        images: prev.images.filter((image) => image !== url),
      }));
    }, 100);
  };
  const removePreviewImage = (url: string) => {
    const index = uploadState.previewUrls.indexOf(url);
    if (index === -1) return;
    URL.revokeObjectURL(url);
    setTimeout(() => {
      setUploadState((prev) => ({
        ...prev,
        selectedFiles: prev.selectedFiles.filter((_, i) => i !== index),
        previewUrls: prev.previewUrls.filter((_, i) => i !== index),
      }));
    }, 100);
  };

  // Kickstart product creation
  const onSubmit = async () => {
    if (loading || uploadState.isUploading) return;
    setLoading(true);
    try {
      const { selectedFiles } = uploadState;
      if (selectedFiles.length > 0) {
        const newUrls = await uploadImages(selectedFiles);
        const updatedProduct = {
          ...Product,
          images: [...(Product.images || []), ...newUrls],
        };
        setUploadState({
          selectedFiles: [],
          previewUrls: [],
          isUploading: false,
        });
        createProduct(updatedProduct);
      } else {
        createProduct(Product);
      }
    } catch (error) {
      console.error("Error in submit:", error);
      window.alert("Error al procesar el producto");
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      uploadState.previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [uploadState.previewUrls]);

  return (
    <section className="w-full">
      <div className="h-full w-full flex flex-col px-1 gap-4">
        <section className="w-full flex gap-4">
          <div className="flex flex-col justify-start w-1/2">
            <section className="flex flex-col gap-4">
              <Label className="text-xl">Imágenes (Opcional)</Label>
              <Input
                type="file"
                multiple
                disabled={loading}
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
              {uploadState.previewUrls.map((url, index) => (
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
          <div className="flex flex-col justify-start w-1/2">
            <Label className="text-xl">Características (Opcional)</Label>
            <section className="flex flex-col justify-evenly h-full">
              <div className="flex flex-col gap-2">
                <Label className="text-md">Color</Label>
                <Input
                  value={Product?.color}
                  disabled={loading}
                  onChange={(e) =>
                    setProduct((prev) => ({ ...prev, color: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-md">Origen</Label>
                <Input
                  value={Product?.origen}
                  disabled={loading}
                  onChange={(e) =>
                    setProduct((prev) => ({ ...prev, origen: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-md">Borde</Label>
                <Input
                  value={Product?.borde}
                  disabled={loading}
                  onChange={(e) =>
                    setProduct((prev) => ({ ...prev, borde: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-md">Aspecto</Label>
                <Input
                  value={Product?.aspecto}
                  disabled={loading}
                  onChange={(e) =>
                    setProduct((prev) => ({ ...prev, aspecto: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-md">Textura</Label>
                <Input
                  value={Product?.textura}
                  disabled={loading}
                  onChange={(e) =>
                    setProduct((prev) => ({ ...prev, textura: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-md">Tránsito</Label>
                <Input
                  value={Product?.transito}
                  disabled={loading}
                  onChange={(e) =>
                    setProduct((prev) => ({
                      ...prev,
                      transito: e.target.value,
                    }))
                  }
                />
              </div>
            </section>
          </div>
        </section>
        <div className="flex flex-row justify-center items-center gap-2">
          <Button
            className="gap-2 bg-chart-2 w-1/6"
            disabled={loading}
            onClick={onSubmit}
          >
            {loading && <Loader2 className="animate-spin" />}
            Guardar
            <CheckCircle2 size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
};
export default ExtraDataTab;
