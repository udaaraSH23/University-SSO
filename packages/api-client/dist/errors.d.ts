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
    readonly COURSE_NOT_FOUND: "COURSE_NOT_FOUND";
    readonly COURSE_ALREADY_EXISTS: "COURSE_ALREADY_EXISTS";
    readonly OFFERING_NOT_FOUND: "OFFERING_NOT_FOUND";
    readonly OFFERING_ALREADY_EXISTS: "OFFERING_ALREADY_EXISTS";
    readonly DEGREE_PROGRAM_NOT_FOUND: "DEGREE_PROGRAM_NOT_FOUND";
    readonly DEPARTMENT_NOT_FOUND: "DEPARTMENT_NOT_FOUND";
    readonly IDENTITY_SERVER_ERROR: "IDENTITY_SERVER_ERROR";
    readonly IDENTITY_USER_NOT_FOUND: "IDENTITY_USER_NOT_FOUND";
    readonly IDENTITY_CREATION_FAILED: "IDENTITY_CREATION_FAILED";
    readonly LENDING_BOOK_UNAVAILABLE: "LENDING_BOOK_UNAVAILABLE";
    readonly LENDING_STUDENT_NOT_REGISTERED: "LENDING_STUDENT_NOT_REGISTERED";
    readonly LENDING_ALREADY_BORROWED: "LENDING_ALREADY_BORROWED";
    readonly LENDING_RECORD_NOT_FOUND: "LENDING_RECORD_NOT_FOUND";
    readonly LENDING_ALREADY_RETURNED: "LENDING_ALREADY_RETURNED";
    readonly BOOK_NOT_FOUND: "BOOK_NOT_FOUND";
    readonly BOOK_ALREADY_EXISTS: "BOOK_ALREADY_EXISTS";
    readonly BOOK_UNAVAILABLE: "BOOK_UNAVAILABLE";
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
