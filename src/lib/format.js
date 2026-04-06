/**
 * Format a currency amount in Kenyan Shillings.
 * Under 1M: "KSh 1,500,000"
 * 1M+: "KSh 1.5M"
 *
 * @param {number} amount    - Amount in KES
 * @param {string} [currency="KES"]
 * @returns {string} Formatted string
 */
export function formatCurrency(amount, currency = "KES") {
  if (amount == null || isNaN(amount)) return "";

  const num = Number(amount);

  if (currency === "KES" || currency === "KSh") {
    if (num >= 1_000_000) {
      const millions = num / 1_000_000;
      // Show up to 1 decimal place if not whole
      const formatted =
        millions === Math.floor(millions)
          ? millions.toString()
          : millions.toFixed(1).replace(/\.0$/, "");
      return `KSh ${formatted}M`;
    }

    return `KSh ${num.toLocaleString("en-KE")}`;
  }

  return `${currency} ${num.toLocaleString("en-KE")}`;
}

/**
 * Format a Date or ISO string to "Apr 4, 2026" format.
 *
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "";

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/**
 * Format a date as relative time — "2 hours ago", "3 days ago", "just now".
 *
 * @param {Date|string} date
 * @returns {string}
 */
export function formatRelativeDate(date) {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  if (diffWeeks < 5) return `${diffWeeks} ${diffWeeks === 1 ? "week" : "weeks"} ago`;
  if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;

  // Fallback for older dates
  return formatDate(d);
}

/**
 * Calculate reading time from word count.
 * Based on average reading speed of 200 words per minute.
 *
 * @param {number} wordCount
 * @returns {string} e.g. "5 min read"
 */
export function formatReadingTime(wordCount) {
  if (!wordCount || wordCount <= 0) return "Less than 1 min read";

  const minutes = Math.ceil(wordCount / 200);

  if (minutes === 1) return "1 min read";
  return `${minutes} min read`;
}

/**
 * Format an employment type value to display string.
 * New DB values are already display-ready ("Full-time", "Part-time", etc.).
 * Legacy enum values ("FULL_TIME", "INTERNSHIP", etc.) are mapped for backward compat.
 *
 * @param {string} value
 * @returns {string}
 */
export function formatJobType(value) {
  if (!value) return "";
  const map = {
    // Legacy enum values
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    TEMPORARY: "Temporary",
    PERMANENT: "Full-time",
    FREELANCE: "Freelance",
    VOLUNTEER: "Volunteer",
  };
  return map[value] || value;
}

/**
 * Format an experience level value to display string.
 * New DB values are already display-ready ("Entry Level", "Mid Level", etc.).
 * Legacy enum values ("ENTRY", "MID", etc.) are mapped for backward compat.
 *
 * @param {string} value
 * @returns {string}
 */
export function formatExperienceLevel(value) {
  if (!value) return "";
  const map = {
    // Legacy enum values
    ENTRY: "Entry Level",
    JUNIOR: "Junior",
    MID: "Mid Level",
    MID_LEVEL: "Mid Level",
    SENIOR: "Senior",
    LEAD: "Lead",
    MANAGER: "Manager",
    DIRECTOR: "Director",
    EXECUTIVE: "Executive",
  };
  return map[value] || value;
}

/**
 * Truncate text to a maximum length, appending "..." if truncated.
 *
 * @param {string} text
 * @param {number} [maxLength=120]
 * @returns {string}
 */
export function truncateText(text, maxLength = 120) {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  // Don't cut in the middle of a word — find last space before limit
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.6) {
    return truncated.slice(0, lastSpace) + "...";
  }

  return truncated + "...";
}
