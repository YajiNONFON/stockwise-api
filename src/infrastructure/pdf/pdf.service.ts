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

// Formate un montant en FCFA sans séparateur décimal problématique
const formatFCFA = (amount: number): string => {
  return `${Math.round(amount).toLocaleString("fr-FR")} FCFA`;
};

// Traduit le statut en français
const translateStatus = (status: string): string => {
  const map: Record<string, string> = {
    PENDING: "EN ATTENTE",
    DELIVERED: "LIVRÉE",
    CANCELLED: "ANNULÉE",
  };
  return map[status] ?? status;
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
        .text("Stockwise — Rapport des commandes", { align: "center" });

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Généré le : ${new Date().toLocaleDateString("fr-FR")}`, {
          align: "center",
        });

      doc.moveDown(2);

      // ─── Résumé ────────────────────────────────────────────────
      const delivered = orders.filter((o) => o.status === "DELIVERED");
      const pending = orders.filter((o) => o.status === "PENDING");
      const cancelled = orders.filter((o) => o.status === "CANCELLED");

      const totalRevenue = delivered.reduce((sum, o) => sum + o.total, 0);
      const totalPotential = pending.reduce((sum, o) => sum + o.total, 0);
      const conversionRate =
        delivered.length + cancelled.length > 0
          ? Math.round(
              (delivered.length / (delivered.length + cancelled.length)) * 100,
            )
          : 0;

      doc.fontSize(12).font("Helvetica-Bold").text("Résumé");
      doc.moveDown(0.5);

      const summary = [
        [`Nombre total de commandes`, `${orders.length}`],
        [`Commandes livrées`, `${delivered.length}`],
        [`Commandes en attente`, `${pending.length}`],
        [`Commandes annulées`, `${cancelled.length}`],
        [`Taux de conversion`, `${conversionRate}%`],
        [`Chiffre d'affaires réel`, formatFCFA(totalRevenue)],
        [`Chiffre d'affaires potentiel`, formatFCFA(totalPotential)],
      ];

      summary.forEach(([label, value]) => {
        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .text(`${label} : `, { continued: true })
          .font("Helvetica")
          .text(value);
      });

      doc.moveDown(2);

      // ─── Commandes ─────────────────────────────────────────────
      doc.fontSize(12).font("Helvetica-Bold").text("Détail des commandes");
      doc.moveDown(1);

      orders.forEach((order, index) => {
        // En-tête commande
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text(
            `${index + 1}. ${order.orderNumber} — ${translateStatus(order.status)} — ${new Date(order.createdAt).toLocaleDateString("fr-FR")}`,
          );

        doc
          .fontSize(10)
          .font("Helvetica")
          .text(
            `Client : ${order.customer.name ?? "Inconnu"}${order.customer.whatsapp ? ` (${order.customer.whatsapp})` : ""}`,
          );

        doc.moveDown(0.5);

        // Lignes produits
        order.orderItems.forEach((item) => {
          doc
            .fontSize(9)
            .text(
              `  • ${item.product.name} × ${item.quantity} — ${formatFCFA(Number(item.unitPrice))} l'unité — Sous-total : ${formatFCFA(Number(item.subtotal))}`,
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
