import DOMPurify from "isomorphic-dompurify";

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr",
      "ul", "ol", "li",
      "strong", "em", "b", "i", "u", "s",
      "a", "blockquote", "code", "pre",
      "table", "thead", "tbody", "tr", "th", "td",
      "div", "span", "img",
    ],
    ALLOWED_ATTR: [
      "href", "target", "rel", "src", "alt", "title",
      "class", "id", "width", "height",
    ],
    ALLOW_DATA_ATTR: false,
  });
}
