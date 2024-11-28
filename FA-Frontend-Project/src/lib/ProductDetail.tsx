import { Button } from "@/components/ui/button";
import { CompleteProduct } from "@/hooks/CatalogInterfaces";
import jsPDF from "jspdf";
import { Download } from "lucide-react";

interface ProductDetailProps {
  Product: CompleteProduct | null;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ Product }) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(`${Product?.name}`, 20, 20);

    // Add Product Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`ID: ${Product?.id}`, 20, 30);
    doc.text(`Categoría: ${Product?.category}`, 20, 35);
    doc.text(`Subcategoría: ${Product?.subcategory}`, 20, 40);
    doc.text(`Proveedor: ${Product?.provider}`, 20, 45);

    // Product Description
    doc.setFont("helvetica", "italic");
    doc.text("Descripción", 20, 55);
    doc.setFont("helvetica", "normal");
    doc.text(`${Product?.description}`, 20, 60, { maxWidth: 170 });

    // Product Sale info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Información de Venta", 20, 75);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(15);
    doc.text(
      `Descuento Actual: ${
        Product?.discountPercentage && Product?.discountPercentage > 0
          ? `${Product?.discountPercentage}%`
          : "N/A"
      }`,
      20,
      85
    );
    doc.text(
      `$ ${
        Product?.discountPercentage && Product?.discountPercentage > 0
          ? `${Product?.discountedMeasurePrice}`
          : `${Product?.measurePrice}`
      } X ${Product?.measureType}`,
      20,
      95
    );
    if (Product?.measureType !== Product?.saleUnit) {
      doc.text(
        `$ ${
          Product?.discountPercentage && Product?.discountPercentage > 0
            ? `${Product?.discountedPrice}`
            : `${Product?.saleUnitPrice}`
        } X ${Product?.saleUnit} (${Product?.measurePerSaleUnit} ${
          Product?.measureType
        })`,
        20,
        105
      );
    }
    let lastTextItemY = Product?.discountPercentage && Product?.discountPercentage > 0 ? 105 : 95;
    // Extra Product info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Información Adicional", 20, lastTextItemY + 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Calidad: ${Product?.quality}`, 20 , lastTextItemY + 30);
    if (Product?.measures) {
      doc.text(`Medidas: ${Product?.measures}`, 20, lastTextItemY + 35);
      lastTextItemY = lastTextItemY + 35;
    } else {
      lastTextItemY = lastTextItemY + 30;
    }
    Product?.tags?.forEach((tag) => {
      lastTextItemY = lastTextItemY + 5;
      doc.text(`${tag.tagKey}: ${tag.value}`, 20, lastTextItemY);
    });

    // Save the PDF
    doc.save(`${Product?.name}_detalle.pdf`);
  };

  return (
    <Button onClick={generatePDF} className="w-10/12 text-md">
      <Download />
      Descargar Detalle
    </Button>
  );
};
