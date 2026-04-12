const FONT_URLS: Record<string, string> = {
  Inter:
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  Figtree:
    "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap",
  "Plus Jakarta Sans":
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
  "DM Sans":
    "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap",
  Roboto:
    "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
  "Roboto Mono":
    "https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600;700&display=swap",
};

const loadedFonts = new Set<string>();

/**
 * Load all supported fonts by injecting Google Fonts stylesheet links.
 * Call once when the editor mounts.
 */
export function loadEditorFonts(): void {
  for (const [family, url] of Object.entries(FONT_URLS)) {
    if (loadedFonts.has(family)) continue;

    const existing = document.querySelector(
      `link[href="${url}"]`
    );
    if (!existing) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      document.head.appendChild(link);
    }

    loadedFonts.add(family);
  }
}
