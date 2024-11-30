/**
 * Formats a date string into a human-readable format.
 * @param published a date string
 * @returns a formatted date string
 */
export default function formatDate(published: string): string {
  try {
    const date = new Date(published);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.error(`Error formatting date: ${published}`, error);
    return "Invalid Date";
  }
}
