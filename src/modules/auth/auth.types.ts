export interface OAuthProfile {
  provider: "GOOGLE" | "FACEBOOK";
  providerId: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
  };
  tokens: AuthTokens;
}
