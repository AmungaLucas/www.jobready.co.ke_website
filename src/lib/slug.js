/**
 * Generate a URL-safe slug from any text string.
 * Handles special characters like em-dashes, ampersands, and accented characters.
 *
 * @param {string} text - e.g. "Senior Accountant — Safaricom PLC"
 * @returns {string}    - e.g. "senior-accountant-safaricom-plc"
 */
export function generateSlug(text) {
  if (!text) return "";

  return text
    .toLowerCase()
    // Normalize common special characters
    .replace(/[—–]/g, "-")   // em-dash, en-dash → hyphen
    .replace(/[&]/g, "-and-") // ampersand
    .replace(/[+]/g, "-plus-")
    .replace(/[@]/g, "-at-")
    // Remove non-alphanumeric except spaces and hyphens
    .replace(/[^a-z0-9\s-]/g, "")
    // Replace multiple spaces/hyphens with single hyphen
    .replace(/[\s]+/g, "-")
    .replace(/-+/g, "-")
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, "")
    // Limit length to 80 chars
    .slice(0, 80);
}

/**
 * Generate a unique order number.
 * Format: JR-YYYYMMDD-XXXX (e.g. "JR-20260404-A7K2")
 *
 * @returns {string}
 */
export function generateOrderNumber() {
  const now = new Date();
  const datePart =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  // Random 4-character alphanumeric
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // removed confusing chars: 0,O,1,I
  let rand = "";
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `JR-${datePart}-${rand}`;
}
