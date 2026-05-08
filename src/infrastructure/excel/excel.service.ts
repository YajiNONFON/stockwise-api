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

export const excelService = {
  async generateOrdersExport(orders: OrderForReport[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Orders");

    sheet.columns = [
      { header: "Order Number", key: "orderNumber", width: 20 },
      { header: "Date", key: "date", width: 15 },
      { header: "Customer", key: "customer", width: 20 },
      { header: "WhatsApp", key: "whatsapp", width: 20 },
      { header: "Product", key: "product", width: 25 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Unit Price", key: "unitPrice", width: 15 },
      { header: "Subtotal", key: "subtotal", width: 15 },
      { header: "Order Total", key: "total", width: 15 },
      { header: "Status", key: "status", width: 12 },
    ];

    // Style header
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9E1F2" },
    };

    orders.forEach((order) => {
      order.orderItems.forEach((item, index) => {
        sheet.addRow({
          orderNumber: index === 0 ? order.orderNumber : "",
          date:
            index === 0
              ? new Date(order.createdAt).toLocaleDateString("fr-FR")
              : "",
          customer: index === 0 ? (order.customer.name ?? "N/A") : "",
          whatsapp: index === 0 ? (order.customer.whatsapp ?? "") : "",
          product: item.product.name,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          subtotal: Number(item.subtotal),
          total: index === 0 ? Number(order.total) : "",
          status: index === 0 ? order.status : "",
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  },
};
