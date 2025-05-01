import { Button } from "@/components/ui/button";
import { CompleteBudget, ProductBudget } from "@/hooks/SalesInterfaces";
import jsPDF from "jspdf";
import { ReceiptText } from "lucide-react";

export const DownloadBudgetDetail = ({
  budget,
}: {
  budget: CompleteBudget | null;
}) => {
  const formatDateTime = (isoDate: string) => {
    if (!isoDate) {
      return "";
    }
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(25);
    doc.setFont("helvetica", "bold");
    doc.text("SB - Cerámicos Olavarría", 10, 20);

    // Date and Company Info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(formatDateTime(budget?.date ?? ""), 10, 30);
    /*     
    doc.text("Calle 122 y 54 - Tel. 412-3001 Lineas Rotativas", 10, 40);
    doc.text("email: consultas@ceramicoslaplata.com.ar", 10, 45);
    */
    // Budget Number
    doc.setFont("helvetica", "bold");
    doc.text(
      `Presupuesto: ${budget?.id?.toString().padStart(10, "0")}`,
      10,
      40
    );
    /* 
    doc.text(
      `Presupuesto: ${budget?.id?.toString().padStart(10, "0")}`,
      10,
      55
    );
    */

    // Client Information
    /*     doc.setFont("helvetica", "normal");
    doc.text("Sr.(es) PRESUPUESTO DISENO10", 10, 65);
    doc.text("Condición frente al IVA: Consumidor Final", 10, 70);
    doc.text("Domicilio: ALBERDI 486", 10, 75);
    doc.text("Condicion de Venta: CONTADO", 10, 80); */

    // Table Headers
    const headers = [
      "Cantidad Solicitada",
      "Unidades",
      "Nombre",
      "Precio Unitario",
      "Descuento",
      "Subtotal",
    ];

    // Draw Table
    let startY = 50;
    // let startY = 90;
    const columnWidths = [30, 30, 60, 30, 30];

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    headers.forEach((header, index) => {
      doc.text(
        header,
        10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
        startY
      );
    });
    doc.setFont("helvetica", "normal");
    startY += 10;

    budget?.products?.forEach((product: ProductBudget) => {
      let rowHeight = 0;
      const cellY = startY;
      const rowData = [
        `${product.measureUnitQuantity} ${product.productMeasureUnit}`,
        `${product.saleUnitQuantity} ${product.productSaleUnit}`,
        product.productName,
        `$ ${product.productMeasurePrice} / ${product.productMeasureUnit}`,
        `${
          !product.discountPercentage ? "N/A" : `${product.discountPercentage}%`
        }`,
        `$ ${product.subtotal}`,
      ];
      rowData.forEach((text, index) => {
        const xPos =
          10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
        const splitText = doc.splitTextToSize(text, columnWidths[index] - 2);
        doc.text(splitText, xPos, cellY);
        rowHeight = Math.max(rowHeight, splitText.length * 4);
      });
      startY += rowHeight + 4;
    });

    // Final Amounts
    startY += 10;
    doc.setFontSize(10);
    const rightAlignX = 125;
    doc.text(
      "Precios sujetos a modificación sin previo aviso.",
      rightAlignX,
      startY
    );
    startY += 10;
    if (budget?.discount && budget?.discount > 0) {
      doc.text(`Descuento: ${budget?.discount}%`, rightAlignX, startY);
      startY += 5;
    }
    doc.text(`Importe Final: $ ${budget?.finalAmount}`, rightAlignX, startY);
    doc.text("Per./Ret. Ingresos Brutos: $ 0,00", rightAlignX, startY + 5);
    doc.text(
      `Importe Total: $ ${budget?.finalAmount}`,
      rightAlignX,
      startY + 10
    );

    // Save PDF
    doc.save(`Presupuesto_${budget?.id}.pdf`);
  };

  return (
    <Button className="w-full" onClick={generatePDF} disabled={budget === null}>
      <ReceiptText />
      Descargar Detalle
    </Button>
  );
};
