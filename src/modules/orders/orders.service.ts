import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../infrastructure/database/prisma.cloud";
import {
  BadRequestException,
  NotFoundException,
} from "../../shared/errors/http-errors";
import { customerRepository } from "../customers/customers.repository";
import { productRepository } from "../products/products.repository";
import { orderCalculator } from "./domain/order-calculator";
import { orderStatusMachine } from "./domain/order-status.machine";
import { generateOrderNumber } from "./domain/order.entity";
import { generateWhatsAppSummary } from "./domain/whatsapp-summary";
import { CreateOrderInput, UpdateOrderInput } from "./orders.dto";
import { orderRepository } from "./orders.repository";

export const orderService = {
  async findOrFail(id: string, userId: string) {
    const order = await orderRepository.getOrderById(id, userId);

    if (!order) {
      throw new NotFoundException("order not found");
    }

    return order;
  },

  async createOrder(userId: string, data: CreateOrderInput) {
    const customer = await customerRepository.getCustomerById(
      data.customerId,
      userId,
    );
    if (!customer) throw new NotFoundException("Customer not found");

    const items = await Promise.all(
      data.orderItems.map(async (item) => {
        const product = await productRepository.getProductById(
          item.productId,
          userId,
        );

        if (!product)
          throw new NotFoundException(`Product ${item.productId} not found`);

        const stockAvailable = product.stockTotal - product.stockReserved;
        if (stockAvailable < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ${product.name}`,
          );
        }

        const unitPrice = Number(product.price);
        const subtotal = orderCalculator.calculateSubtotal(
          item.quantity,
          unitPrice,
        );

        return {
          productId: item.productId,
          productName: product.name,
          quantity: item.quantity,
          unitPrice,
          subtotal,
        };
      }),
    );

    const total = orderCalculator.calculateTotal(
      items.map((i) => ({ quantity: i.quantity, unitPrice: i.unitPrice })),
    );

    const orderNumber = await generateOrderNumber();

    const order = await orderRepository.createOrder(
      userId,
      orderNumber,
      total,
      data,
      items,
    );

    await Promise.all(
      items.map((item) =>
        productRepository.updateStock(item.productId, undefined, item.quantity),
      ),
    );

    const summary = generateWhatsAppSummary({
      orderNumber: order.orderNumber,
      customerName: customer.name,
      items: items.map((item, index) => ({
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      })),
      total,
      status: order.status,
      note: order.note,
    });

    return { order, whatsappSummary: summary };
  },

  async getAllOrders(
    userId: string,
    page: number,
    limit: number,
    status?: OrderStatus,
    search?: string,
  ) {
    const orders = await orderRepository.getAllOrders(
      userId,
      page,
      limit,
      search,
      status,
    );

    return orders;
  },

  async getOrderById(id: string, userId: string) {
    return this.findOrFail(id, userId);
  },

  async updateOrder(id: string, userId: string, data: UpdateOrderInput) {
    const order = await this.findOrFail(id, userId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException("Only PENDING orders can be updated");
    }

    let items:
      | {
          productId: string;
          quantity: number;
          unitPrice: number;
          subtotal: number;
        }[]
      | undefined = undefined;

    let total: number | undefined = undefined;

    if (data.orderItems && data.orderItems.length > 0) {
      await Promise.all(
        order.orderItems.map((item) =>
          productRepository.updateStock(
            item.productId,
            undefined,
            -item.quantity,
          ),
        ),
      );

      items = await Promise.all(
        data.orderItems.map(async (item) => {
          const product = await productRepository.getProductById(
            item.productId,
            userId,
          );

          if (!product)
            throw new NotFoundException(`Product ${item.productId} not found`);

          const stockAvailable = product.stockTotal - product.stockReserved;
          if (stockAvailable < item.quantity) {
            throw new BadRequestException(
              `Insufficient stock for product ${product.name}`,
            );
          }

          const unitPrice = Number(product.price);
          const subtotal = orderCalculator.calculateSubtotal(
            item.quantity,
            unitPrice,
          );

          return {
            productId: item.productId,
            quantity: item.quantity,
            unitPrice,
            subtotal,
          };
        }),
      );

      await Promise.all(
        items.map((item) =>
          productRepository.updateStock(
            item.productId,
            undefined,
            item.quantity,
          ),
        ),
      );

      total = orderCalculator.calculateTotal(
        items.map((i) => ({ quantity: i.quantity, unitPrice: i.unitPrice })),
      );
    }

    return orderRepository.updateOrder(id, userId, {
      note: data.note,
      total,
      items,
    });
  },

  async updateOrderStatus(id: string, userId: string, status: OrderStatus) {
    const order = await this.findOrFail(id, userId);

    orderStatusMachine.assertTransitionAllowed(order.status, status);

    if (status === OrderStatus.DELIVERED) {
      await Promise.all(
        order.orderItems.map((item) =>
          productRepository.updateStock(
            item.productId,
            -item.quantity, // stockTotal diminue
            -item.quantity, // stockReserved libéré
          ),
        ),
      );
    }

    if (status === OrderStatus.CANCELLED) {
      await Promise.all(
        order.orderItems.map((item) =>
          productRepository.updateStock(
            item.productId,
            undefined,
            -item.quantity,
          ),
        ),
      );
    }

    // 4. Mettre à jour le statut
    return orderRepository.updateOrderStatus(id, userId, status);
  },
  async deleteOrder(id: string, userId: string) {
    const order = await this.findOrFail(id, userId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException("Only PENDING orders can be deleted");
    }

    await Promise.all(
      order.orderItems.map((item) =>
        productRepository.updateStock(
          item.productId,
          undefined,
          -item.quantity,
        ),
      ),
    );

    const deletedOrder = await orderRepository.deleteOrder(id, userId);

    return deletedOrder;
  },
};
