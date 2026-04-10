import { z } from "zod";

const homeSectionsSchema = z.object({
  hero: z.boolean(),
  about: z.boolean(),
  location: z.boolean(),
  faq: z.boolean(),
});

const homePageSchema = z.object({
  visible: z.literal(true),
  title: z.string().min(1).max(100),
  sections: homeSectionsSchema,
});

const toggleablePageSchema = z.object({
  visible: z.boolean(),
  title: z.string().min(1).max(100),
});

const pagesSchema = z.object({
  home: homePageSchema,
  schedule: toggleablePageSchema,
  speakers: toggleablePageSchema,
});

const themeSettingsSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color"),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color"),
  fontFamily: z.string().min(1).max(50),
});

const metaSettingsSchema = z.object({
  title: z.string().max(200),
  description: z.string().max(500),
  ogImage: z.string(),
});

const registrationSettingsSchema = z.object({
  ctaText: z.string().min(1).max(100),
  ctaPosition: z.string(),
});

const navbarSettingsSchema = z.object({
  style: z.string(),
  showLogo: z.boolean(),
});

const footerSettingsSchema = z.object({
  showOrganizer: z.boolean(),
  customText: z.string().max(500),
});

const settingsSchema = z.object({
  theme: themeSettingsSchema,
  meta: metaSettingsSchema,
  registration: registrationSettingsSchema,
  navbar: navbarSettingsSchema,
  footer: footerSettingsSchema,
});

export const websitePagesSchema = z.object({
  pages: pagesSchema,
  settings: settingsSchema,
});

export const saveWebsitePagesSchema = z.object({
  eventId: z.string().uuid(),
  websitePages: websitePagesSchema,
});

export type SaveWebsitePagesInput = z.infer<typeof saveWebsitePagesSchema>;
