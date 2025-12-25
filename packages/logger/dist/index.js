"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const pino_1 = __importDefault(require("pino"));
const createLogger = (config = {}) => {
    const { level = process.env.LOG_LEVEL || "info", service } = config;
    const isDev = process.env.NODE_ENV === "development";
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
    if (isDev) {
        return (0, pino_1.default)({
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
    return (0, pino_1.default)(options);
};
exports.createLogger = createLogger;
