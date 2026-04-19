import DOMPurify from "dompurify";

/**
 * Sanitize HTML content from user-generated sources.
 * Allows safe HTML tags (p, h1-h6, ul, ol, li, a, strong, em, br, etc.)
 * Strips script tags, event handlers, and other XSS vectors.
 *
 * Usage:
 *   import { sanitizeHtml } from "@/lib/sanitize";
 *   <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userContent) }} />
 */
export function sanitizeHtml(html) {
  if (!html) return "";

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "hr",
      "div",
      "span",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "strong",
      "em",
      "b",
      "i",
      "u",
      "blockquote",
      "pre",
      "code",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "img",
      "figure",
      "figcaption",
      "sub",
      "sup",
    ],
    ALLOWED_ATTR: [
      "href",
      "src",
      "alt",
      "title",
      "class",
      "id",
      "target",
      "rel",
      "style",
    ],
    ALLOW_DATA_ATTR: false,
  });
}
