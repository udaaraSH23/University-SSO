import { Logger } from "pino";
export interface LoggerConfig {
    level?: string;
    service?: string;
}
export declare const createLogger: (config?: LoggerConfig) => Logger;
