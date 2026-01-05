"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiClient = exports.ApiClient = void 0;
const errors_1 = require("./errors");
/**
 * Executes a server function (Service method or Server Action) safely.
 * Catches backend errors and translates them to the Client Error contract.
 *
 * Usage:
 * const data = await apiClient.execute(() => studentService.getProfile(email));
 */
class ApiClient {
    /**
     * Executes the provided async function and handles errors.
     * @param fn - The async function to execute (e.g. service call)
     */
    async execute(fn) {
        try {
            return await fn();
        }
        catch (error) {
            // If validation error or domain error with a 'code'
            if (error && error.code) {
                throw new errors_1.ApiClientError(error.message || "Operation failed", error.code, error.details, error);
            }
            // If it's already an ApiClientError (nested calls), rethrow
            if (error instanceof errors_1.ApiClientError) {
                throw error;
            }
            // Default to Internal Error for unmapped exceptions
            throw new errors_1.ApiClientError(error.message || "An unexpected error occurred", errors_1.ERROR_CODES.INTERNAL_ERROR, undefined, error);
        }
    }
}
exports.ApiClient = ApiClient;
exports.apiClient = new ApiClient();
