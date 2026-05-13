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

// ─── Helpers ───────────────────────────────────────────────────────────────

const formatFCFA = (amount: number): string =>
  `${Math.round(amount).toLocaleString("fr-FR")} FCFA`;

const translateStatus = (status: string): string => {
  const map: Record<string, string> = {
    PENDING: "EN ATTENTE",
    DELIVERED: "LIVRÉE",
    CANCELLED: "ANNULÉE",
  };
  return map[status] ?? status;
};

const formatDate = (date: Date): string =>
  new Date(date).toLocaleDateString("fr-FR");

// ─── Service ───────────────────────────────────────────────────────────────

export const pdfService = {
  async generateOrderReport(orders: OrderForReport[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40 });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // ─── En-tête ──────────────────────────────────────────────
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("Stockwise — Rapport des commandes", { align: "center" });

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Généré le : ${formatDate(new Date())}`, { align: "center" });

      doc.moveDown(2);

      // ─── Résumé ───────────────────────────────────────────────
      const delivered = orders.filter((o) => o.status === "DELIVERED");
      const pending = orders.filter((o) => o.status === "PENDING");
      const cancelled = orders.filter((o) => o.status === "CANCELLED");
      const totalRevenue = delivered.reduce((sum, o) => sum + o.total, 0);
      const totalPotential = pending.reduce((sum, o) => sum + o.total, 0);
      const total = delivered.length + cancelled.length;
      const conversionRate =
        total > 0 ? Math.round((delivered.length / total) * 100) : 0;

      doc.fontSize(12).font("Helvetica-Bold").text("Résumé");
      doc.moveDown(0.5);

      const summaryLines: [string, string][] = [
        ["Nombre total de commandes", String(orders.length)],
        ["Commandes livrées", String(delivered.length)],
        ["Commandes en attente", String(pending.length)],
        ["Commandes annulées", String(cancelled.length)],
        ["Taux de conversion", `${conversionRate}%`],
        ["Chiffre d'affaires réel", formatFCFA(totalRevenue)],
        ["Chiffre d'affaires potentiel", formatFCFA(totalPotential)],
      ];

      summaryLines.forEach(([label, value]) => {
        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .text(`${label} : `, { continued: true })
          .font("Helvetica")
          .text(value);
      });

      doc.moveDown(2);

      // ─── Détail des commandes ─────────────────────────────────
      doc.fontSize(12).font("Helvetica-Bold").text("Détail des commandes");
      doc.moveDown(1);

      orders.forEach((order, index) => {
        const clientName = order.customer.name ?? "Inconnu";
        const clientPhone = order.customer.whatsapp
          ? ` (${order.customer.whatsapp})`
          : "";

        // En-tête commande
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text(
            `${index + 1}. ${order.orderNumber} — ${translateStatus(order.status)} — ${formatDate(order.createdAt)}`,
          );

        doc
          .fontSize(10)
          .font("Helvetica")
          .text(`Client : ${clientName}${clientPhone}`);

        doc.moveDown(0.5);

        // Lignes produits
        order.orderItems.forEach((item) => {
          const name = item.product?.name ?? "Produit inconnu";
          const qty = item.quantity;
          const unitPrice = formatFCFA(Number(item.unitPrice));
          const subtotal = formatFCFA(Number(item.subtotal));

          doc
            .fontSize(9)
            .font("Helvetica")
            .text(
              `  • ${name} × ${qty} — ${unitPrice} l'unité — Sous-total : ${subtotal}`,
            );
        });

        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .text(`  Total : ${formatFCFA(Number(order.total))}`);

        doc.moveDown(1);

        // Séparateur
        if (index < orders.length - 1) {
          doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
          doc.moveDown(1);
        }
      });

      doc.end();
    });
  },
};
