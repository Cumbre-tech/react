// utils/formatDate.ts

/**
 * Formtas a date into a readable format.
 * @param date - Date in date, string or number format.
 * @param locale - Locale settings (e.g., "en-US", "es-ES").
 * @param options - Options for Intl.DateTimeFormat.
 * @returns Date formatted as string.
 */
export const formatDate = (
  date: Date | string | number,
  locale: string = "en-US",
  options: Intl.DateTimeFormatOptions = {}
): string => {
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date");
    }
    return new Intl.DateTimeFormat(locale, options).format(parsedDate);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

/**
 * Returns a date formatted as "DD/MM/YYYY".
 * @param date - Date in date, string or number format.
 * @returns Date in format "DD/MM/YYYY".
 */
export const formatToShortDate = (date: Date | string | number): string => {
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date");
    }
    const day = parsedDate.getDate().toString().padStart(2, "0");
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};
