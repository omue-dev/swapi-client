import DOMPurify from "dompurify";

/** 1) Entfernt ChatGPT-/Word-Zitationsblöcke + Links (inkl. Inhalt) */
const stripCitationsAndLinks = (html: string): string => {
  if (!html) return "";

  // komplette "webpage-citation-pill" inkl. verschachtelter Spans entfernen
  html = html.replace(/<span[^>]*data-testid="webpage-citation-pill"[^>]*>[\s\S]*?<\/span>/gi, "");
  // evtl. umschließende, leere Container-Spans, die nur die Pill enthalten haben
  html = html.replace(/<span[^>]*>\s*<\/span>/gi, "");

  // falls noch nackte <a> übrig sind: komplett inkl. Inhalt entfernen
  html = html.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, "");

  return html;
};

/** 2) Sicheres Sanitizing – erlaubt nur Tags/Attribute, die wir brauchen */
const safeSanitize = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      // Text/Struktur
      "p", "br", "div", "span", "strong", "em", "b", "i", "u",
      "h1", "h2", "h3", "h4", "h5", "h6",
      // Listen
      "ul", "ol", "li",
      // Tabellen
      "figure", "table", "thead", "tbody", "tr", "th", "td",
      // Sonstiges
      "hr", "blockquote", "pre", "code"
    ],
    // Nur die Attribute, die im Shop wirklich gebraucht werden
    ALLOWED_ATTR: [
      "style", "colspan", "rowspan", "align", "scope", "width", "height"
    ],
    ALLOW_DATA_ATTR: false, // ← killt data-start / data-end direkt
  });
};

/** 3) Unerwünschte Attribute restlos entfernen (id, class, aria-*, data-*, tabindex, role, contenteditable, draggable …) */
const stripUnwantedAttributes = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const allowed = new Set(["style", "colspan", "rowspan", "align", "scope", "width", "height"]);

    doc.body.querySelectorAll("*").forEach((el) => {
    // NamedNodeMap zu Array casten
    const attrs = Array.from(el.attributes);

    attrs.forEach((attr: Attr) => {
      const name = attr.name.toLowerCase();
      const isForbiddenPrefix =
        name.startsWith("data-") || name.startsWith("aria-");
      const isForbiddenExact =
        name === "id" ||
        name === "class" ||
        name === "tabindex" ||
        name === "role" ||
        name === "contenteditable" ||
        name === "draggable" ||
        name === "dir";

      if (!allowed.has(name) && (isForbiddenPrefix || isForbiddenExact)) {
        el.removeAttribute(name);
      }
    });
  });


  return doc.body.innerHTML;
};

/** 4) Tabellen in Shop-Layout bringen */
export const formatTablesForShop = (html: string): string => {
  if (!html) return "";

  // Wrapper von Editoren entfernen
  html = html.replace(/<div[^>]*_tableContainer_[^>]*>/gi, "");
  html = html.replace(/<div[^>]*_tableWrapper_[^>]*>/gi, "");
  html = html.replace(/<\/div>/gi, "");

  // Jede Tabelle in <figure> einwickeln (falls nicht schon)
  html = html.replace(/(?<!<figure>)\s*(<table[\s\S]*?<\/table>)/gi, "<figure>$1</figure>");

  // Grundstyles für table/th/td ergänzen, wenn nicht vorhanden
  html = html.replace(
    /<table(?![^>]*style=)/gi,
    `<table style="width: 100%; border-collapse: collapse; font-size: 16px; text-align: left; margin: 20px 0;"`
  );
  html = html.replace(
    /<th(?![^>]*style=)/gi,
    `<th style="padding: 10px; border: 1px solid #ddd; background-color: #f4f4f4;"`
  );
  html = html.replace(
    /<td(?![^>]*style=)/gi,
    `<td style="padding: 16px; border: 1px solid #ddd;"`
  );

  // Zebra-Streifen: jede 2. <tr> im <tbody>
  // Grundstyles für table/th/td ergänzen, wenn nicht vorhanden
  html = html.replace(
    /<table(?![^>]*style=)/gi,
    `<table style="width: auto; max-width: 700px; border-collapse: collapse; font-size: 16px; text-align: left; margin: 20px auto; border-spacing: 0;"`
  );


   // 💣 Entfernt fehlerhafte, leere oder zerstückelte Table-Header-Zeilen
  html = html.replace(/<th[^>]*?(?:thead|ead)[^>]*?><tr>[\s\S]*?<\/thead>/gi, "");
  html = html.replace(/<th[^>]*>\s*<\/th>/gi, ""); // komplett leere <th>
  html = html.replace(/<thead[^>]*>\s*<\/thead>/gi, ""); // leere thead-Wrapper
  html = html.replace(/<tr[^>]*>\s*<\/tr>/gi, ""); // komplett leere Tabellenzeilen


  // 🧮 Erste Spalte dynamisch: max 50%, aber flexibel bei kürzerem Text
  // 🧮 Erste Spalte dynamisch – max 50%, darf umbrechen
const parser = new DOMParser();
const doc = parser.parseFromString(html, "text/html");

doc.querySelectorAll("table").forEach((table) => {
  const rows = table.querySelectorAll("tr");
    rows.forEach((row) => {
      const firstCell = row.querySelector("td:first-child");
      if (firstCell) {
        const style = firstCell.getAttribute("style") || "";
        const updatedStyle = `${style}; width: auto; max-width: 30%; white-space: normal; word-wrap: break-word;`;
        firstCell.setAttribute("style", updatedStyle);
      }
    });
  });

  html = doc.body.innerHTML;

  return html;
};

/** 5) <li><p>…</p></li> zu <li>…</li> umschreiben */
export const unwrapLiParagraphs = (html: string): string => {
  if (!html) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Alle <p>, die direkte Kinder von <li> sind, auspacken
  doc.querySelectorAll("li > p").forEach((p) => {
    const li = p.parentElement;
    if (!li) return;
    while (p.firstChild) {
      li.insertBefore(p.firstChild, p);
    }
    p.remove();
  });

  return doc.body.innerHTML;
};

/** 🔥 Alles-in-einem: Clean + Strip + Format */
export const cleanAndFormatDescription = (html: string): string => {
  let out = stripCitationsAndLinks(html);
  out = safeSanitize(out);                 // data-* ist hier schon weg
  out = stripUnwantedAttributes(out);      // falls noch id/class/aria… überlebt haben
  out = unwrapLiParagraphs(out);           // <li><p>…</p></li> → <li>…</li>
  out = formatTablesForShop(out);          // schönes Shop-Layout
  return out.trim();
};
