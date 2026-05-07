type LineItem = {
  quantity: number;
  unitPrice: number;
};

export const orderCalculator = {
  calculateSubtotal(quantity: number, unitPrice: number): number {
    return Math.round(quantity * unitPrice * 100) / 100;
  },

  calculateTotal(items: LineItem[]): number {
    const total = items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);

    return Math.round(total * 100) / 100;
  },
};
