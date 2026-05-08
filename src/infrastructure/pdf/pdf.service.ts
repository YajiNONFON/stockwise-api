import PDFDocument from "pdfkit";

type OrderForReport = {
  orderNumber: string;
  status: string;
  total: number;
  createdAt: Date;
  customer: { name: string | null; whatsapp: string | null };
  orderItems: {
    quantity: number;
    unitPrice: number;
    subtotal: number;
    product: { name: string };
  }[];
};

export const pdfService = {
  async generateOrderReport(orders: OrderForReport[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40 });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // ─── Header ────────────────────────────────────────────────
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("Stockwise — Orders Report", { align: "center" });

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Generated on: ${new Date().toLocaleDateString("fr-FR")}`, {
          align: "center",
        });

      doc.moveDown(2);

      // ─── Summary ───────────────────────────────────────────────
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(`Total orders: ${orders.length}`);

      const totalRevenue = orders
        .filter((o) => o.status === "DELIVERED")
        .reduce((sum, o) => sum + o.total, 0);

      doc
        .fontSize(12)
        .text(`Total revenue: ${totalRevenue.toLocaleString("fr-FR")} FCFA`);

      doc.moveDown(2);

      // ─── Orders ────────────────────────────────────────────────
      orders.forEach((order, index) => {
        // Order header
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text(
            `${index + 1}. ${order.orderNumber} — ${order.status} — ${new Date(order.createdAt).toLocaleDateString("fr-FR")}`,
          );

        doc
          .fontSize(10)
          .font("Helvetica")
          .text(
            `Customer: ${order.customer.name ?? "N/A"} ${order.customer.whatsapp ? `(${order.customer.whatsapp})` : ""}`,
          );

        doc.moveDown(0.5);

        // Order items
        order.orderItems.forEach((item) => {
          doc
            .fontSize(9)
            .text(
              `  • ${item.product.name} × ${item.quantity} @ ${Number(item.unitPrice).toLocaleString("fr-FR")} = ${Number(item.subtotal).toLocaleString("fr-FR")} FCFA`,
            );
        });

        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .text(`  Total: ${Number(order.total).toLocaleString("fr-FR")} FCFA`);

        doc.moveDown(1);

        // Separator
        if (index < orders.length - 1) {
          doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
          doc.moveDown(1);
        }
      });

      doc.end();
    });
  },
};
