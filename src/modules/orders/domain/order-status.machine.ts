import { OrderStatus } from "../../../../generated/prisma/enums";
import { BadRequestException } from "../../../shared/errors/http-errors";

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
  DELIVERED: [],
  CANCELLED: [],
};

export const orderStatusMachine = {
  assertTransitionAllowed(current: OrderStatus, next: OrderStatus): void {
    const allowed = ALLOWED_TRANSITIONS[current];

    if (allowed.length === 0) {
      throw new BadRequestException(
        `Order in status ${current} cannot be modified`,
      );
    }

    if (!allowed.includes(next)) {
      throw new BadRequestException(
        `Cannot transition from ${current} to ${next}`,
      );
    }
  },
};

/*
 * FLOW OVERVIEW — order-state-machine.ts
 *
 *
 *
 * Allowed transitions:
 * - PENDING      → DELIVERED, CANCELLED
 * - DELIVERED   → (nothing, final)
 * - CANCELLED  → (nothing, final)
 *
 * DELIVERED and CANCELLED are all terminal states — no way out.
 */
