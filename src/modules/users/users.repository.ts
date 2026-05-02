import { prisma } from "../../infrastructure/database/prisma.cloud";

export const userRepository = {
  async findUserById(id: string) {
    return await prisma.user.findUnique({ where: { id } });
  },

  async updateUser(
    id: string,
    data: Partial<{ name: string; avatar: string }>,
  ) {
    return await prisma.user.update({ where: { id }, data });
  },

  async deleteUser(id: string) {
    return await prisma.user.delete({ where: { id } });
  },
};
