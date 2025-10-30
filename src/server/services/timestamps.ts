/**
 * Converts a UTC timestamp string to a Date object if valid.
 * @param dateString The UTC timestamp string.
 * @returns A Date object or null if the input is invalid.
 */
export function convertUTCStringToDate(dateString: string): Date | null {
    // Regular expression to check if the string is in a proper ISO 8601 format
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

    if (regex.test(dateString)) {
        const date = new Date(dateString);

        // Check if the date is valid
        if (!isNaN(date.getTime())) {
            return date;
        } else {
            console.error("Invalid date: Conversion failed", dateString);
        }
    } else {
        console.error("Invalid format for UTC timestamp", dateString);
    }

    return null;
}