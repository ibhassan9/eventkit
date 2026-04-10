import type { WebsiteConfig, WebsitePages } from "@eventkit/types";

export function resolveTheme(event: {
  websitePages?: WebsitePages | null;
  websiteConfig?: WebsiteConfig | null;
}) {
  if (event.websitePages?.settings?.theme) {
    const t = event.websitePages.settings.theme;
    return {
      primaryColor: t.primaryColor ?? "#7C3AED",
      accentColor: t.accentColor ?? "#F59E0B",
      fontFamily: t.fontFamily ?? "inter",
    };
  }

  if (event.websiteConfig?.theme) {
    const t = event.websiteConfig.theme;
    return {
      primaryColor: t.primaryColor ?? "#7C3AED",
      accentColor: t.secondaryColor ?? "#F59E0B",
      fontFamily: t.fontFamily ?? "inter",
    };
  }

  return {
    primaryColor: "#7C3AED",
    accentColor: "#F59E0B",
    fontFamily: "inter",
  };
}
