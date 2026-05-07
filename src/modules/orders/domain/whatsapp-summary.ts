import { OrderStatus } from "../../../../generated/prisma/enums";

interface SummaryItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface OrderSummaryInput {
  orderNumber: string;
  customerName: string | null;
  items: SummaryItem[];
  total: number;
  status: OrderStatus;
  note?: string | null;
}

export function generateWhatsAppSummary(order: OrderSummaryInput): string {
  const statusLabel: Record<OrderStatus, string> = {
    PENDING: "⏳ EN ATTENTE",
    DELIVERED: "✅ LIVRÉE",
    CANCELLED: "❌ ANNULÉE",
  };

  const formatPrice = (amount: number) =>
    amount.toLocaleString("fr-FR") + " FCFA";

  const itemLines = order.items
    .map(
      (item) =>
        `• ${item.productName} × ${item.quantity} = ${formatPrice(item.subtotal)}`,
    )
    .join("\n");

  const noteLine = order.note ? `\n📝 Note: ${order.note}` : "";

  return `📦 *Commande ${order.orderNumber}*
👤 Client: ${order.customerName ?? "Non renseigné"}
─────────────────
${itemLines}
─────────────────
💰 *Total: ${formatPrice(order.total)}*
📌 Statut: ${statusLabel[order.status]}${noteLine}`;
}
