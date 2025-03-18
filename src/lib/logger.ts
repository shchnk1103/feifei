const isDevelopment = process.env.NODE_ENV === "development";

type LogArgs = unknown[];

export const logger = {
  debug: (...args: LogArgs) => {
    if (isDevelopment) {
      console.log("[DEBUG]", ...args);
    }
  },
  info: (...args: LogArgs) => {
    if (isDevelopment) {
      console.info("[INFO]", ...args);
    }
  },
  warn: (...args: LogArgs) => {
    if (isDevelopment) {
      console.warn("[WARN]", ...args);
    }
  },
  error: (...args: LogArgs) => {
    if (isDevelopment) {
      console.error("[ERROR]", ...args);
    }
  },
};
