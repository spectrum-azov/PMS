/**
 * Formats a phone number string into +38 (0XX) XXX-XX-XX format
 * @param phone Raw phone number (e.g., +380981234567)
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string): string {
    if (!phone) return '';

    // Remove non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');

    // Check if it matches the expected +380XXXXXXXXX format
    if (cleaned.startsWith('+380') && cleaned.length === 13) {
        return `+38 (${cleaned.slice(4, 7)}) ${cleaned.slice(7, 10)}-${cleaned.slice(10, 12)}-${cleaned.slice(12, 14)}`;
    }

    // Fallback if format is slightly different but still roughly correct
    if (cleaned.length === 12 && cleaned.startsWith('380')) {
        return `+38 (${cleaned.slice(3, 6)}) ${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}-${cleaned.slice(11, 13)}`;
    }

    if (cleaned.length === 10 && cleaned.startsWith('0')) {
        return `+38 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
    }

    return phone;
}
