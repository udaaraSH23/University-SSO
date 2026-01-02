"use strict";
// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251226-US-LOGGER-INDEX
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T22:45:00Z
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const pino_1 = __importDefault(require("pino"));
const __FP_SIG = "FP-20251226-US-LOGGER-INDEX|HASH-PLACEHOLDER";
const globalForLogger = global;
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
const createLogger = (config = {}) => {
    const isDev = process.env.NODE_ENV === "development";
    const { level = process.env.LOG_LEVEL || (isDev ? "debug" : "info"), service, } = config;
    // Create a unique key for the logger configuration
    const cacheKey = JSON.stringify({ service, level });
    // Return cached instance if it exists
    if (globalForLogger.pinoLoggers.has(cacheKey)) {
        return globalForLogger.pinoLoggers.get(cacheKey);
    }
    const options = {
        level,
        base: service ? { service } : undefined,
        formatters: {
            level: (label) => ({ level: label }),
        },
        redact: {
            paths: ["password", "token", "secret", "authorization", "cookie"],
            censor: "[REDACTED]",
        },
        timestamp: pino_1.default.stdTimeFunctions.isoTime,
    };
    let logger;
    if (isDev) {
        logger = (0, pino_1.default)({
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
    else {
        logger = (0, pino_1.default)(options);
    }
    // Cache the new instance
    globalForLogger.pinoLoggers.set(cacheKey, logger);
    return logger;
};
exports.createLogger = createLogger;
