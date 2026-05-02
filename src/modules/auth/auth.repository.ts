import { Provider } from "../../../generated/prisma/enums";
import { prisma } from "../../infrastructure/database/prisma.cloud";
export const authRepository = {
  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async findUserByProvider(provider: Provider, providerId: string) {
    return prisma.user.findFirst({
      where: { provider, providerId },
    });
  },

  async createUserFromOAuth(profile: {
    email: string;
    name?: string;
    avatar?: string;
    provider: Provider;
    providerId: string;
  }) {
    return prisma.user.create({
      data: {
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar,
        provider: profile.provider,
        providerId: profile.providerId,
      },
    });
  },

  async saveRefreshToken(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({ data: { userId, token, expiresAt } });
  },

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({ where: { token } });
  },

  async revokeRefreshToken(token: string) {
    return prisma.refreshToken.update({
      where: { token },
      data: { revokedAt: new Date() },
    });
  },

  async revokeAllUserRefreshTokens(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  },
};
