/**
 * Executes a server function (Service method or Server Action) safely.
 * Catches backend errors and translates them to the Client Error contract.
 *
 * Usage:
 * const data = await apiClient.execute(() => studentService.getProfile(email));
 */
export declare class ApiClient {
    /**
     * Executes the provided async function and handles errors.
     * @param fn - The async function to execute (e.g. service call)
     */
    execute<T>(fn: () => Promise<T>): Promise<T>;
}
export declare const apiClient: ApiClient;
