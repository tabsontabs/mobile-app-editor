/**
 * Validates if a string is a valid 6-digit hex color (e.g., #000000)
 */
export function isValidHex(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}
