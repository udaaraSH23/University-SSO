import pino, { Logger, LoggerOptions } from "pino";

export interface LoggerConfig {
  level?: string;
  service?: string;
}

export const createLogger = (config: LoggerConfig = {}): Logger => {
  const { level = process.env.LOG_LEVEL || "info", service } = config;

  const isDev = process.env.NODE_ENV === "development";

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

  if (isDev) {
    return pino({
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
  }

  return pino(options);
};
