/**
 * This function returns a promise that resolves in a set amount of time
 * @param ms time to wait in milliseconds before resolving
 */
export function Timeout(ms: number) {
    return new Promise((resolve) => {
        // Set up the timeout
        setTimeout(() => {
            resolve("Promise timed out after " + ms + " ms");
        }, ms);
    });
}
