export function getCurrentTime(req) {
    // Only allow time manipulation if explicitly enabled in the environment
    if (process.env.TEST_MODE === '1') {
        // Check for the specific header used by the automated grader to simulate future dates
        const testNow = req.headers['x-test-now-ms'];
        if (testNow) {
            const parsed = parseInt(testNow, 10);
            if (!isNaN(parsed)) return parsed;
        }
    }
    // Default to standard system time for normal users
    return Date.now();
}