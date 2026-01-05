"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClientError = exports.ERROR_CODES = void 0;
// Replicating the contract from backend
exports.ERROR_CODES = {
    // Generic
    VALIDATION_ERROR: "VALIDATION_ERROR",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    INTERNAL_ERROR: "INTERNAL_ERROR",
    DB_FAILURE: "DB_FAILURE",
    RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
    // Student Context
    STUDENT_NOT_FOUND: "STUDENT_NOT_FOUND",
    STUDENT_ALREADY_EXISTS: "STUDENT_ALREADY_EXISTS",
    // User Context
    USER_NOT_FOUND: "USER_NOT_FOUND",
};
class ApiClientError extends Error {
    constructor(message, code, details, originalError) {
        super(message);
        this.code = code;
        this.details = details;
        this.originalError = originalError;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.ApiClientError = ApiClientError;
