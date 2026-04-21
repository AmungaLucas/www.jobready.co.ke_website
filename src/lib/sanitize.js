/**
 * Server-safe HTML sanitizer (no DOM dependency).
 *
 * Unlike DOMPurify, this works during Next.js SSR / static generation
 * because it relies on regex parsing instead of the browser DOM API.
 *
 * Strategy:
 *  1. Remove <script>, <iframe>, <object>, <embed>, <form>, <meta>,
 *     <link>, <style>, <noscript>, <template>, <svg>, <math> tags
 *     and their contents entirely.
 *  2. Strip all event-handler attributes (onclick, onerror, onload, …)
 *     including backtick-quoted variants.
 *  3. Strip javascript:, data:, vbscript: URIs from href/src attributes.
 *  4. Remove any remaining tags not on the whitelist.
 *  5. Strip non-whitelisted attributes from allowed tags.
 *  6. Strip HTML comments.
 *
 * SECURITY NOTE: This sanitizer handles admin-authored CMS content.
 * For untrusted user input, consider migrating to isomorphic-dompurify.
 */

// ─── Tag / attribute whitelists ────────────────────────────────────
const ALLOWED_TAGS = new Set([
  "p", "br", "hr", "div", "span",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "a",
  "strong", "em", "b", "i", "u", "s",
  "blockquote", "pre", "code",
  "table", "thead", "tbody", "tr", "th", "td",
  "img", "figure", "figcaption",
  "sub", "sup", "mark", "small",
]);

const ALLOWED_ATTRS = new Set([
  "href", "src", "alt", "title", "class", "id",
  "target", "rel", "width", "height",
  "loading", "decoding", "referrerpolicy",
  // Note: "style" intentionally removed to prevent CSS-based data exfiltration
]);

// Tags whose *entire content* should be removed (not just the tags)
// Includes SVG and MathML to prevent namespace confusion XSS vectors
const DANGEROUS_TAGS = new Set([
  "script", "iframe", "object", "embed", "form",
  "meta", "link", "style", "noscript", "template",
  "svg", "math", "base",
]);

/**
 * Sanitize an HTML string for safe rendering with dangerouslySetInnerHTML.
 *
 * @param {string} html — raw HTML (may contain XSS vectors)
 * @returns {string} — sanitized HTML
 */
export function sanitizeHtml(html) {
  if (!html || typeof html !== "string") return "";

  let output = html;

  // ─── 0. Strip HTML comments (before tag processing to prevent comment-based bypasses) ──
  output = output.replace(/<!--[\s\S]*?-->/g, "");

  // ─── 1. Remove dangerous tags and their content ────────────────
  // Handle unclosed tags: also match opening tags without closing counterparts
  for (const tag of DANGEROUS_TAGS) {
    // Match <tag ...>...</tag> (with content)
    const re = new RegExp(`<${tag}[\\s>][\\s\\S]*?<\\/${tag}>`, "gi");
    output = output.replace(re, "");
    // Self-closing variants: <tag ... />
    const reSelf = new RegExp(`<${tag}[\\s>][^>]*/?>`, "gi");
    output = output.replace(reSelf, "");
    // Unclosed opening tags: <tag ...> (no closing tag at all)
    const reOpen = new RegExp(`<${tag}[\\s>][^>]*>`, "gi");
    output = output.replace(reOpen, "");
  }

  // ─── 2. Strip event-handler attributes ─────────────────────────
  // Match on*="...", on*='...', and on*=`...` (backtick-quoted variants)
  // Also handle bare on* attributes without values
  output = output.replace(
    /\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|`[^`]*`)/gi,
    ""
  );
  // Bare on* attributes (e.g., <div onclick>)
  output = output.replace(
    /\s+on\w+(?=\s|>|\/>)/gi,
    ""
  );

  // ─── 3. Neutralise javascript: / data: / vbscript: URIs ─────────
  output = output.replace(
    /(href|src)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi,
    (_, attr, d1, d2) => {
      const val = d1 ?? d2 ?? "";
      // Remove any URI scheme that could execute code
      const cleaned = val.replace(/^\s*(javascript|data|vbscript)\s*:/i, "");
      return `${attr}="${cleaned}"`;
    }
  );

  // ─── 4. Remove tags not on the whitelist ────────────────────────
  output = stripDisallowedTags(output);

  // ─── 5. Strip non-whitelisted attributes on allowed tags ────────
  output = stripDisallowedAttrs(output);

  // ─── 6. Final safety pass: remove any residual dangerous patterns ──
  // Remove null bytes and control characters
  output = output.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "");

  return output.trim();
}

// ─── Helpers ──────────────────────────────────────────────────────

/**
 * Replace every tag that is NOT in ALLOWED_TAGS with an empty string.
 * Preserves allowed opening tags, closing tags, and self-closing tags.
 * Content inside disallowed tags is kept (only the tag itself is stripped).
 */
function stripDisallowedTags(html) {
  return html.replace(
    /<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^>]*?)?)(\/?)>/g,
    (_, tagName, attrs, selfClose) => {
      const name = tagName.toLowerCase();
      if (ALLOWED_TAGS.has(name)) {
        return `<${name}${attrs}${selfClose}>`;
      }
      return "";
    }
  );
}

/**
 * For every allowed tag, keep only attributes in ALLOWED_ATTRS.
 */
function stripDisallowedAttrs(html) {
  const allowedPattern = ALLOWED_TAGS
    ? Array.from(ALLOWED_TAGS).join("|")
    : "a";

  const tagRe = new RegExp(
    `<(?:${allowedPattern})((?:\\s+[^>]*?)?)(\\/?)>`,
    "gi"
  );

  return html.replace(tagRe, (_, attrStr, selfClose) => {
    if (!attrStr || !attrStr.trim()) {
      return `<${selfClose}>`;
    }

    const cleaned = parseAndFilterAttrs(attrStr);
    return `<${cleaned}${selfClose}>`;
  });
}

/**
 * Parse an attribute string and return only the allowed attributes.
 */
function parseAndFilterAttrs(attrStr) {
  const result = [];
  const attrRe = /\s+([a-zA-Z_:][\w:.-]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;

  let match;
  while ((match = attrRe.exec(attrStr)) !== null) {
    const name = match[1].toLowerCase();
    if (!ALLOWED_ATTRS.has(name)) continue;

    if (match[2] !== undefined) {
      result.push(` ${name}="${match[2]}"`);
    } else if (match[3] !== undefined) {
      result.push(` ${name}="${match[3]}"`);
    } else if (match[4] !== undefined) {
      result.push(` ${name}="${match[4]}"`);
    } else {
      result.push(` ${name}`);
    }
  }

  return result.join("");
}
