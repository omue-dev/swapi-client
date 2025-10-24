import DOMPurify from "dompurify";

/**
 * 🧰 Clean & format rich text HTML for safe use in the shop.
 * ---------------------------------------------------------
 * This utility performs a full cleanup pipeline on arbitrary HTML input (e.g. from
 * ChatGPT, Word, or a WYSIWYG editor). It removes noise, dangerous tags, Word styles,
 * and inconsistent markup while preserving semantic structure (headings, lists, tables, etc).
 *
 * Steps:
 *  1. Remove citations & links
 *  2. Sanitize with DOMPurify (safe whitelist)
 *  3. Strip unwanted attributes
 *  4. Remove all <span> wrappers
 *  5. (optional) Apply custom formatting (e.g. tables)
 */

const DEBUG = false; // set true for console logging of each step

/**
 * STEP 1: Remove unwanted editor artifacts
 * ----------------------------------------
 * Removes ChatGPT or Word-generated elements like citation spans or <a> tags.
 */
const stripCitationsAndLinks = (doc: Document): void => {
  // Remove citation pills by data-testid
  doc.querySelectorAll('span[data-testid="webpage-citation-pill"]').forEach(el => el.remove());
  // Remove all <a> (links) entirely, including content
  doc.querySelectorAll("a").forEach(el => el.remove());
};

/**
 * STEP 2: DOMPurify configuration
 * -------------------------------
 * Restricts allowed tags & attributes and prevents CSS-based script injection.
 */
DOMPurify.addHook("uponSanitizeAttribute", (node, data) => {
  // Block any dangerous inline CSS (e.g. expression() or JS URLs)
  if (data.attrName === "style" && /expression|javascript:/i.test(data.attrValue)) {
    data.keepAttr = false;
  }
});

const safeSanitize = (html: string): string => {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      "p", "br", "div", "strong", "em", "b", "i", "u",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li",
      "figure", "table", "thead", "tbody", "tr", "th", "td",
      "hr", "blockquote", "pre", "code"
    ],
    ALLOWED_ATTR: [
      "style", "colspan", "rowspan", "align", "scope", "width", "height"
    ],
    ALLOW_DATA_ATTR: false
  });
};

/**
 * STEP 3: Remove unwanted attributes
 * ----------------------------------
 * Cleans attributes like id, class, aria-*, data-*, etc.
 */
const stripUnwantedAttributesDOM = (doc: Document): void => {
  const allowed = new Set(["style", "colspan", "rowspan", "align", "scope", "width", "height"]);

  doc.body.querySelectorAll("*").forEach((el) => {
    Array.from(el.attributes).forEach((attr: Attr) => {
      const name = attr.name.toLowerCase();
      const isForbiddenPrefix = name.startsWith("data-") || name.startsWith("aria-");
      const isForbiddenExact = [
        "id", "class", "tabindex", "role",
        "contenteditable", "draggable", "dir"
      ].includes(name);

      if (!allowed.has(name) && (isForbiddenPrefix || isForbiddenExact)) {
        el.removeAttribute(name);
      }

      // Remove Word-style inline CSS (e.g. mso-fareast-language)
      if (name === "style" && /mso-/i.test(attr.value)) {
        el.removeAttribute("style");
      }
    });
  });
};

/**
 * STEP 4: Remove all <span> wrappers
 * ----------------------------------
 * Replaces all <span> elements with their plain text content
 * and normalizes whitespace (except inside <pre>/<code> blocks).
 */
const removeAllSpansDOM = (doc: Document): void => {
  doc.body.querySelectorAll("span").forEach((span) => {
    const text = span.textContent || "";
    const textNode = doc.createTextNode(text);
    span.replaceWith(textNode);
  });

  // Normalize whitespace but preserve <pre> / <code> contents
  const preBlocks: string[] = [];
  let index = 0;

  // Temporarily replace <pre>/<code> with placeholders
  doc.body.querySelectorAll("pre, code").forEach((block) => {
    const placeholder = `__PRESERVE_BLOCK_${index}__`;
    preBlocks.push(block.outerHTML);
    block.replaceWith(placeholder);
    index++;
  });

  let cleaned = doc.body.innerHTML;
  cleaned = cleaned.replace(/\s{2,}/g, " ");
  cleaned = cleaned.replace(/>\s+</g, "><");
  cleaned = cleaned.replace(/\n\s+/g, "\n");
  cleaned = cleaned.trim();

  // Restore <pre>/<code> blocks
  preBlocks.forEach((original, i) => {
    cleaned = cleaned.replace(`__PRESERVE_BLOCK_${i}__`, original);
  });

  doc.body.innerHTML = cleaned;
};

export const cleanAndFormatDescription = (html: string): string => {
  if (!html) return "";

  // Step 1 & 2: Pre-clean & sanitize
  let sanitized = safeSanitize(html);

  // Step 3+: Work with DOM once (performance!)
  const parser = new DOMParser();
  const doc = parser.parseFromString(sanitized, "text/html");

  stripCitationsAndLinks(doc);
  stripUnwantedAttributesDOM(doc);
  removeAllSpansDOM(doc);
  // formatTablesForShop(doc); // if needed

  const result = doc.body.innerHTML.trim();

  if (DEBUG) {
    console.group("HTML Cleaning Pipeline");
    console.log("Original HTML:", html);
    console.log("After sanitize:", sanitized);
    console.log("After attribute strip:", doc.body.innerHTML);
    console.groupEnd();
  }

  return result;
};
