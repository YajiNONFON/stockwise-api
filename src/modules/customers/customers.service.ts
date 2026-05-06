import { NotFoundException } from "../../shared/errors/http-errors";
import { CreateCustomerInput, UpdateCustomerInput } from "./customers.dto";
import { customerRepository } from "./customers.repository";

export const customerService = {
  async findOrFail(id: string, userId: string) {
    const customer = await customerRepository.getCustomerById(id, userId);

    if (!customer) {
      throw new NotFoundException("customer not found");
    }

    return customer;
  },

  async createCustomer(userId: string, data: CreateCustomerInput) {
    const customer = await customerRepository.createCustomer(userId, data);

    return customer;
  },

  async getAllCustomers(
    userId: string,
    page: number,
    limit: number,
    search?: string,
  ) {
    const customers = await customerRepository.getAllCustomers(
      userId,
      page,
      limit,
      search,
    );

    return customers;
  },

  async getCustomerById(id: string, userId: string) {
    return this.findOrFail(id, userId);
  },

  async updateCustomer(id: string, userId: string, data: UpdateCustomerInput) {
    const customer = await this.findOrFail(id, userId);

    const updatedCustomer = await customerRepository.updateCustomer(
      id,
      userId,
      data,
    );

    return updatedCustomer;
  },

  async deleteCustomer(id: string, userId: string) {
    const customer = await this.findOrFail(id, userId);

    const deletedCustomer = await customerRepository.deleteCustomer(id, userId);

    return deletedCustomer;
  },
};
