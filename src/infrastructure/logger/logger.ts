import { env } from "../../shared/config/env";

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(`ℹ️  [INFO] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`❌ [ERROR] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`⚠️  [WARN] ${message}`, ...args);
  },
  debug: (message: string, ...args: unknown[]) => {
    if (env.nodeEnv === "development") {
      console.log(`🐛 [DEBUG] ${message}`, ...args);
    }
  },
};
