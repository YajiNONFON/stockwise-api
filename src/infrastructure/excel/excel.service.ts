import ExcelJS from "exceljs";

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

const translateStatus = (status: string): string => {
  const map: Record<string, string> = {
    PENDING: "EN ATTENTE",
    DELIVERED: "LIVRÉE",
    CANCELLED: "ANNULÉE",
  };
  return map[status] ?? status;
};

export const excelService = {
  async generateOrdersExport(orders: OrderForReport[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = "Stockwise";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Commandes");

    sheet.columns = [
      { header: "N° Commande", key: "orderNumber", width: 20 },
      { header: "Date", key: "date", width: 15 },
      { header: "Client", key: "customer", width: 22 },
      { header: "WhatsApp", key: "whatsapp", width: 20 },
      { header: "Produit", key: "product", width: 28 },
      { header: "Quantité", key: "quantity", width: 12 },
      { header: "Prix unitaire (FCFA)", key: "unitPrice", width: 22 },
      { header: "Sous-total (FCFA)", key: "subtotal", width: 20 },
      { header: "Total commande (FCFA)", key: "total", width: 22 },
      { header: "Statut", key: "status", width: 15 },
    ];

    // Style en-tête
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FF000000" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE6B800" },
    };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.height = 20;

    orders.forEach((order) => {
      order.orderItems.forEach((item, index) => {
        const row = sheet.addRow({
          orderNumber: index === 0 ? order.orderNumber : "",
          date:
            index === 0
              ? new Date(order.createdAt).toLocaleDateString("fr-FR")
              : "",
          customer: index === 0 ? (order.customer.name ?? "Inconnu") : "",
          whatsapp: index === 0 ? (order.customer.whatsapp ?? "") : "",
          product: item.product.name,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          subtotal: Number(item.subtotal),
          total: index === 0 ? Number(order.total) : "",
          status: index === 0 ? translateStatus(order.status) : "",
        });

        if (index === 0) {
          const statusColor =
            order.status === "DELIVERED"
              ? "FFD4EDDA"
              : order.status === "CANCELLED"
                ? "FFF8D7DA"
                : "FFFFF3CD";

          row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: statusColor },
          };
        }

        // Format nombre pour les montants
        ["unitPrice", "subtotal", "total"].forEach((col) => {
          const cell = row.getCell(col);
          if (cell.value) {
            cell.numFmt = '#,##0" FCFA"';
          }
        });
      });
    });

    const summarySheet = workbook.addWorksheet("Résumé");

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

    summarySheet.columns = [
      { header: "Indicateur", key: "label", width: 35 },
      { header: "Valeur", key: "value", width: 25 },
    ];

    const summaryHeaderRow = summarySheet.getRow(1);
    summaryHeaderRow.font = { bold: true };
    summaryHeaderRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE6B800" },
    };

    const summaryData = [
      ["Nombre total de commandes", orders.length],
      ["Commandes livrées", delivered.length],
      ["Commandes en attente", pending.length],
      ["Commandes annulées", cancelled.length],
      ["Taux de conversion", `${conversionRate}%`],
      ["Chiffre d'affaires réel (FCFA)", totalRevenue],
      ["Chiffre d'affaires potentiel (FCFA)", totalPotential],
    ];

    summaryData.forEach(([label, value]) => {
      const row = summarySheet.addRow({ label, value });
      if (typeof value === "number" && String(label).includes("FCFA")) {
        row.getCell("value").numFmt = '#,##0" FCFA"';
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  },
};
