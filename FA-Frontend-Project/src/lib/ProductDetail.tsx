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

    // Title
    doc.setFontSize(25);
    doc.setFont("helvetica", "bold");
    doc.text("SB - Cerámicos Olavarría", 10, 20);

    // Product Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(`${Product?.name}`, 10, 40);

    // Add Product Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Código: ${Product?.code}`, 10, 50);
    doc.text(`Categoría: ${Product?.category}`, 10, 55);
    doc.text(`Subcategoría: ${Product?.subcategory}`, 10, 60);
    doc.text(`Proveedor: ${Product?.provider}`, 10, 65);

    // Product Description
    doc.text(`${Product?.description}`, 10, 75, { maxWidth: 170 });

    // Product Sale info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Información de Venta", 10, 100);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(15);
    doc.text(
      `Descuento Actual: ${
        Product?.discountPercentage && Product?.discountPercentage > 0
          ? `${Product?.discountPercentage}%`
          : "N/A"
      }`,
      10,
      110
    );
    doc.text(
      `$ ${
        Product?.discountPercentage && Product?.discountPercentage > 0
          ? `${Product?.discountedMeasurePrice}`
          : `${Product?.measurePrice}`
      } X ${Product?.measureType}`,
      10,
      120
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
        10,
        130
      );
    }
    let lastTextItemY = Product?.discountPercentage && Product?.discountPercentage > 0 ? 130 : 120;
    // Extra Product info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Información Adicional", 10, lastTextItemY + 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Calidad: ${Product?.quality}`, 10 , lastTextItemY + 30);
    if (Product?.measures) {
      doc.text(`Medidas: ${Product?.measures}`, 10, lastTextItemY + 35);
      lastTextItemY = lastTextItemY + 35;
    } else {
      lastTextItemY = lastTextItemY + 30;
    }
    if (Product?.color) {
      doc.text(`Color: ${Product?.color}`, 10, lastTextItemY + 30);
      lastTextItemY = lastTextItemY + 30;
    }
    if (Product?.origen) {
      doc.text(`Origen: ${Product?.origen}`, 10, lastTextItemY + 30);
      lastTextItemY = lastTextItemY + 30;
    }
    if (Product?.borde) {
      doc.text(`Borde: ${Product?.borde}`, 10, lastTextItemY + 30);
      lastTextItemY = lastTextItemY + 30;
    }
    if (Product?.aspecto) {
      doc.text(`Aspecto: ${Product?.aspecto}`, 10, lastTextItemY + 30);
      lastTextItemY = lastTextItemY + 30;
    }
    if (Product?.textura) {
      doc.text(`Textura: ${Product?.textura}`, 10, lastTextItemY + 30);
      lastTextItemY = lastTextItemY + 30;
    }
    if (Product?.transito) {
      doc.text(`Transito: ${Product?.transito}`, 10, lastTextItemY + 30);
      lastTextItemY = lastTextItemY + 30;
    }

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
