/**
 * Server-safe HTML sanitizer (no DOM dependency).
 *
 * Unlike DOMPurify, this works during Next.js SSR / static generation
 * because it relies on regex parsing instead of the browser DOM API.
 *
 * Strategy:
 *  1. Remove <script>, <iframe>, <object>, <embed>, <form>, <meta>,
 *     <link>, <style> tags and their contents entirely.
 *  2. Strip all event-handler attributes (onclick, onerror, onload, …).
 *  3. Strip javascript: and data: URIs from href/src attributes.
 *  4. Remove any remaining tags not on the whitelist.
 *  5. Strip non-whitelisted attributes from allowed tags.
 *
 * This content originates from the admin-authored blog/job CMS,
 * so a whitelist-based approach provides adequate XSS protection
 * without needing a full DOM parser.
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
  "target", "rel", "style", "width", "height",
  "loading", "decoding", "referrerpolicy",
]);

// Tags whose *entire content* should be removed (not just the tags)
const DANGEROUS_TAGS = new Set([
  "script", "iframe", "object", "embed", "form",
  "meta", "link", "style", "noscript", "template",
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

  // ─── 1. Remove dangerous tags and their content ────────────────
  // Match opening tag, closing tag, and everything in between (non-greedy)
  for (const tag of DANGEROUS_TAGS) {
    const re = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi");
    output = output.replace(re, "");
    // Self-closing variants
    const reSelf = new RegExp(`<${tag}[^>]*/?>`, "gi");
    output = output.replace(reSelf, "");
  }

  // ─── 2. Strip event-handler attributes ─────────────────────────
  // Match on*="..." and on*='...' inside any tag
  output = output.replace(
    /\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*')/gi,
    ""
  );

  // ─── 3. Neutralise javascript: / data: URIs in href & src ───────
  output = output.replace(
    /(href|src)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi,
    (_, attr, d1, d2) => {
      const val = d1 ?? d2 ?? "";
      const cleaned = val.replace(/^\s*(javascript|data|vbscript)\s*:/i, "");
      return `${attr}="${cleaned}"`;
    }
  );

  // ─── 4. Remove tags not on the whitelist ────────────────────────
  // Strategy: process the string tag by tag.
  output = stripDisallowedTags(output);

  // ─── 5. Strip non-whitelisted attributes on allowed tags ────────
  output = stripDisallowedAttrs(output);

  // ─── 6. Remove HTML comments ──────────────────────────────────
  output = output.replace(/<!--[\s\S]*?-->/g, "");

  return output.trim();
}

// ─── Helpers ──────────────────────────────────────────────────────

/**
 * Replace every tag that is NOT in ALLOWED_TAGS with an empty string.
 * Preserves allowed opening tags, closing tags, and self-closing tags.
 * Content inside disallowed tags is kept (only the tag itself is stripped).
 */
function stripDisallowedTags(html) {
  // Match any HTML tag: <tagname ...> or </tagname> or <tagname ... />
  return html.replace(
    /<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^>]*?)?)(\/?)>/g,
    (_, tagName, attrs, selfClose) => {
      const name = tagName.toLowerCase();
      if (ALLOWED_TAGS.has(name)) {
        // Keep the tag — reconstruct it
        return `<${name}${attrs}${selfClose}>`;
      }
      // Strip the tag, keep any content around it
      return "";
    }
  );
}

/**
 * For every allowed tag, keep only attributes in ALLOWED_ATTRS.
 */
function stripDisallowedAttrs(html) {
  // Match allowed opening tags and process their attributes
  const allowedPattern = ALLOWED_TAGS
    ? Array.from(ALLOWED_TAGS).join("|")
    : "a";

  // Match only opening tags of allowed elements
  const tagRe = new RegExp(
    `<(?:${allowedPattern})((?:\\s+[^>]*?)?)(\\/?)>`,
    "gi"
  );

  return html.replace(tagRe, (_, attrStr, selfClose) => {
    if (!attrStr || !attrStr.trim()) {
      return `<${selfClose}>`;
    }

    // Parse attributes — split on whitespace, handle quoted values
    const cleaned = parseAndFilterAttrs(attrStr);
    return `<${cleaned}${selfClose}>`;
  });
}

/**
 * Parse an attribute string like ' href="..." class="foo" onclick="bar" '
 * and return only the allowed attributes.
 */
function parseAndFilterAttrs(attrStr) {
  const result = [];
  // Match attribute name=value pairs (including bare boolean attrs)
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
