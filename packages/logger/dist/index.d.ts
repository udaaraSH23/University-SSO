import { Logger, LoggerOptions } from "pino";
export type { Logger, LoggerOptions };
export interface LoggerConfig {
    level?: string;
    service?: string;
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
export declare const createLogger: (config?: LoggerConfig) => Logger;
