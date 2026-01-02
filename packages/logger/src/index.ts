// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251226-US-LOGGER-INDEX
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T22:45:00Z

import pino, { Logger, LoggerOptions } from "pino";

const __FP_SIG = "FP-20251226-US-LOGGER-INDEX|HASH-PLACEHOLDER";
export type { Logger, LoggerOptions };

export interface LoggerConfig {
  level?: string;
  service?: string;
}

const globalForLogger = global as unknown as {
  pinoLoggers: Map<string, Logger>;
};

if (!globalForLogger.pinoLoggers) {
  globalForLogger.pinoLoggers = new Map();
}

/**
 * Creates a configured Pino logger instance.
 *
 * Implements caching using a global map to prevent multiple logger instances
 * during hot reloads or multiple imports, especially in Next.js development.
 *
 * @param {LoggerConfig} config - Configuration options (level, service name)
 * @returns {Logger} Configured Pino logger instance
 */
export const createLogger = (config: LoggerConfig = {}): Logger => {
  const isDev = process.env.NODE_ENV === "development";
  const {
    level = process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
    service,
  } = config;

  // Create a unique key for the logger configuration
  const cacheKey = JSON.stringify({ service, level });

  // Return cached instance if it exists
  if (globalForLogger.pinoLoggers.has(cacheKey)) {
    return globalForLogger.pinoLoggers.get(cacheKey)!;
  }

  const options: LoggerOptions = {
    level,
    base: service ? { service } : undefined,
    formatters: {
      level: (label) => ({ level: label }),
    },
    redact: {
      paths: ["password", "token", "secret", "authorization", "cookie"],
      censor: "[REDACTED]",
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  };

  let logger: Logger;

  if (isDev) {
    logger = pino({
      ...options,
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname",
          translateTime: "SYS:standard",
        },
      },
    });
  } else {
    logger = pino(options);
  }

  // Cache the new instance
  globalForLogger.pinoLoggers.set(cacheKey, logger);

  return logger;
};
