export declare class ApiClient {
    /**
     * Validates data against a Zod-like schema.
     * @param schema - Schema with a parse method (e.g., Zod schema)
     * @param data - Data to validate
     * @returns Validated data
     * @throws ApiClientError if validation fails
     */
    validate<T>(schema: {
        parse: (data: unknown) => T;
    }, data: unknown): T;
    /**
     * Executes the provided async function and handles errors.
     * @param fn - The async function to execute (e.g. service call)
     * @returns The result of the function
     */
    execute<T>(fn: () => Promise<T>): Promise<T>;
}
export declare const apiClient: ApiClient;
