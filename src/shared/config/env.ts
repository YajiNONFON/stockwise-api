import "dotenv/config";

const requiredEnvVars = ["DATABASE_URL"] as const;

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
};
