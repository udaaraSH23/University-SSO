export declare const ERROR_CODES: {
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly INTERNAL_ERROR: "INTERNAL_ERROR";
    readonly DB_FAILURE: "DB_FAILURE";
    readonly RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND";
    readonly STUDENT_NOT_FOUND: "STUDENT_NOT_FOUND";
    readonly STUDENT_ALREADY_EXISTS: "STUDENT_ALREADY_EXISTS";
    readonly USER_NOT_FOUND: "USER_NOT_FOUND";
};
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
export interface ApiErrorResponse {
    code: ErrorCode;
    message: string;
    details?: any;
}
export declare class ApiClientError extends Error {
    code: ErrorCode;
    details?: any;
    originalError?: any;
    constructor(message: string, code: ErrorCode, details?: any, originalError?: any);
}
