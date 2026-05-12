import { authRepository } from "./auth.repository";
import { OAuthProfile, AuthResponse } from "./auth.types";
import { authPolicy } from "./domain/auth-policy";
import { tokenGenerator } from "./domain/token-generator";
import { UnauthorizedException } from "../../shared/errors/http-errors";

export const authService = {
  async handleOAuthCallback(profile: OAuthProfile): Promise<AuthResponse> {
    if (!profile?.provider || !profile?.providerId || !profile?.email) {
      throw new UnauthorizedException(
        "Invalid OAuth profile — missing required fields",
      );
    }

    let user = await authRepository.findUserByProvider(
      profile.provider,
      profile.providerId,
    );

    if (!user) {
      user = await authRepository.createUserFromOAuth(profile);
    }

    const accessToken = tokenGenerator.generateAccessToken({
      userId: user.id,
      email: user.email,
    });
    const refreshToken = tokenGenerator.generateRefreshToken();
    const expiresAt = tokenGenerator.getRefreshTokenExpiry();

    await authRepository.saveRefreshToken(user.id, refreshToken, expiresAt);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      tokens: { accessToken, refreshToken },
    };
  },

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const stored = await authRepository.findRefreshToken(refreshToken);

    if (!stored || !authPolicy.isRefreshTokenValid(stored)) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const user = await authRepository.findUserById(stored.userId);

    if (!user) throw new UnauthorizedException("User not found");

    const accessToken = tokenGenerator.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    return { accessToken };
  },

  async logout(refreshToken: string): Promise<void> {
    await authRepository.revokeRefreshToken(refreshToken);
  },
};
