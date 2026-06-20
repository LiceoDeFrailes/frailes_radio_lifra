import DOMPurify from "dompurify";

/**
 * Sanitiza HTML para prevenir XSS.
 * Permite: tags básicos de formato, imágenes, links, tablas, listas
 * Bloquea: scripts, event handlers, iframes, object/embed
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") return html; // SSR fallback
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "b", "em", "i", "u", "s", "strike",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "blockquote", "code", "pre",
      "a", "img", "table", "thead", "tbody", "tr", "td", "th",
      "div", "span", "hr", "sup", "sub"
    ],
    ALLOWED_ATTR: [
      "href", "title", "target", "rel",
      "src", "alt", "width", "height",
      "class", "style", "data-*"
    ],
    ALLOW_DATA_ATTR: true,
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
  });
}
