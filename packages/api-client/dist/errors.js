"use strict";
// Author: System
// Project: University-Portal
// FP-ID: FP-20260105-API-ERRORS
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-05T11:05:00Z
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClientError = exports.ERROR_CODES = void 0;
const __FP_SIG = "FP-20260105-API-ERRORS|HASH-PLACEHOLDER";
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
    // Academics Context
    COURSE_NOT_FOUND: "COURSE_NOT_FOUND",
    COURSE_ALREADY_EXISTS: "COURSE_ALREADY_EXISTS",
    OFFERING_NOT_FOUND: "OFFERING_NOT_FOUND",
    OFFERING_ALREADY_EXISTS: "OFFERING_ALREADY_EXISTS",
    DEGREE_PROGRAM_NOT_FOUND: "DEGREE_PROGRAM_NOT_FOUND",
    DEPARTMENT_NOT_FOUND: "DEPARTMENT_NOT_FOUND",
    // Identity Context
    IDENTITY_SERVER_ERROR: "IDENTITY_SERVER_ERROR",
    IDENTITY_USER_NOT_FOUND: "IDENTITY_USER_NOT_FOUND",
    IDENTITY_CREATION_FAILED: "IDENTITY_CREATION_FAILED",
    // Lending Context
    LENDING_BOOK_UNAVAILABLE: "LENDING_BOOK_UNAVAILABLE",
    LENDING_STUDENT_NOT_REGISTERED: "LENDING_STUDENT_NOT_REGISTERED",
    LENDING_ALREADY_BORROWED: "LENDING_ALREADY_BORROWED",
    LENDING_RECORD_NOT_FOUND: "LENDING_RECORD_NOT_FOUND",
    LENDING_ALREADY_RETURNED: "LENDING_ALREADY_RETURNED",
    // Books Context
    BOOK_NOT_FOUND: "BOOK_NOT_FOUND",
    BOOK_ALREADY_EXISTS: "BOOK_ALREADY_EXISTS",
    BOOK_UNAVAILABLE: "BOOK_UNAVAILABLE",
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
