/**
 * employment.js — Shared employment type mapping utilities.
 *
 * Two mappings:
 *   1. toDbFormat(val) — Normalises Title Case → UPPER_SNAKE_CASE for DB queries
 *   2. toGoogleJobsFormat(type) — Maps internal types → Google Jobs schema format
 */

// ─── DB Format Mapping ──────────────────────────────────────────

/**
 * Normalize an employment type value to UPPER_SNAKE_CASE for database queries.
 * Accepts both Title Case (legacy frontend) and UPPER_SNAKE (canonical) values.
 *
 * @param {string} val — Input employment type
 * @returns {string|undefined} — Normalized UPPER_SNAKE_CASE value
 */
export function toDbFormat(val) {
  if (!val) return undefined;
  // Already UPPER_SNAKE — return as-is
  if (/^[A-Z][A-Z0-9_]*$/.test(val)) return val;
  // Common legacy mappings
  const legacy = {
    "Full-time": "FULL_TIME",
    "Part-time": "PART_TIME",
    Contract: "CONTRACT",
    Internship: "INTERNSHIP",
    Freelance: "FREELANCE",
    Volunteer: "VOLUNTEER",
  };
  return legacy[val] || val;
}

// ─── Google Jobs Format Mapping ──────────────────────────────────

/**
 * Map internal employment type to Google's expected format for JSON-LD.
 *
 * @param {string} type — Internal employment type
 * @returns {string} — Google Jobs schema format
 */
export function toGoogleJobsFormat(type) {
  const mapping = {
    // Canonical UPPER_SNAKE_CASE values
    FULL_TIME: "FULL_TIME",
    PART_TIME: "PART_TIME",
    CONTRACT: "CONTRACTOR",
    INTERNSHIP: "INTERN",
    FREELANCE: "CONTRACTOR",
    VOLUNTEER: "VOLUNTEER",
    TEMPORARY: "TEMPORARY",
    PERMANENT: "FULL_TIME",
    // Legacy Title Case display values (backward compat)
    "Full-time": "FULL_TIME",
    "Part-time": "PART_TIME",
    "Contract": "CONTRACTOR",
    "Internship": "INTERN",
    "Freelance": "CONTRACTOR",
    "Volunteer": "VOLUNTEER",
  };
  return mapping[type] || "FULL_TIME";
}
