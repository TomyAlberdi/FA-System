import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import { ReceiptText } from "lucide-react";

export const DownloadBudgetDetail = () => {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.addImage(
      "https://fa-sa-bucket.s3.sa-east-1.amazonaws.com/logo_clp_2020.png",
      "JPEG",
      10,
      10,
      100,
      20
    );

    // Date and Company Info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("14/01/2025 13:57:21", 15, 30);
    doc.text("Calle 122 y 54 - Tel. 412-3001 Lineas Rotativas", 15, 40);
    doc.text("email: consultas@ceramicoslaplata.com.ar", 15, 45);

    // Budget Number
    doc.setFont("helvetica", "bold");
    doc.text("Presupuesto: 0000125415", 15, 55);

    // Client Information
    doc.setFont("helvetica", "normal");
    doc.text("Sr.(es) PRESUPUESTO DISENO10", 15, 65);
    doc.text("Condición frente al IVA: Consumidor Final", 15, 70);
    doc.text("Domicilio: ALBERDI 486", 15, 75);
    doc.text("Condicion de Venta: CONTADO", 15, 80);

    // Table Headers
    const headers = [
      "Cantidad Solicitada",
      "Cantidad en Unidades",
      "Nombre",
      "Precio Unitario",
      "Subtotal",
    ];
    const data = [
      [
        "10,10 M2",
        "5,00 CAJA",
        "ALBERDI AXELLA BLANCO",
        "15.260,00 M2",
        "154.126,00",
      ],
      [
        "31,68 M2",
        "11,00 CAJA",
        "ALBERDI PORCE.METROPOLITAN GREY REC FIT",
        "17.534,37 M2",
        "555.489,00",
      ],
    ];

    // Draw Table
    let startY = 90;
    const columnWidths = [30, 30, 60, 30, 30];

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    headers.forEach((header, index) => {
      doc.text(
        header,
        15 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
        startY
      );
    });
    doc.setFont("helvetica", "normal");
    startY += 10;

    data.forEach((row) => {
      let rowHeight = 0;
      const cellY = startY;
      row.forEach((text, index) => {
        const xPos =
          15 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
        const splitText = doc.splitTextToSize(text, columnWidths[index] - 2);
        doc.text(splitText, xPos, cellY);
        rowHeight = Math.max(rowHeight, splitText.length * 4);
      });
      startY += rowHeight + 4;
    });

    // Final Amounts
    startY += 10;
    doc.setFontSize(10); // Restore font size
    doc.text("Precios sujetos a modificación sin previo aviso.", 15, startY);
    startY += 10;
    doc.text("Importe Final: 709.614,98", 15, startY);
    doc.text("Per./Ret. Ingresos Brutos: 0,00", 15, startY + 5);
    doc.text("Importe Total: 709.614,98", 15, startY + 10);

    // Save PDF
    doc.save("Presupuesto.pdf");
  };

  return (
    <Button className="w-full" onClick={generatePDF}>
      <ReceiptText />
      Descargar Detalle
    </Button>
  );
};
