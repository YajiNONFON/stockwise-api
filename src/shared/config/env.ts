import "dotenv/config";

const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "FACEBOOK_APP_ID",
  "FACEBOOK_APP_SECRET",
] as const;

//const requiredEnvVars = ["DATABASE_URL"] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`❌ Missing required environment variable: ${envVar}`);
  }
}

export const env = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL!,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  facebookAppId: process.env.FACEBOOK_APP_ID!,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET!,
};
