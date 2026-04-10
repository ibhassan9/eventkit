import { z } from "zod";

const heroDataSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().max(500),
  ctaText: z.string().min(1).max(50),
  backgroundImageUrl: z.string().url().optional(),
});

const aboutDataSchema = z.object({
  content: z.string().min(1).max(5000),
});

const scheduleItemSchema = z.object({
  time: z.string().min(1).max(50),
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  speaker: z.string().max(100).optional(),
});

const scheduleDataSchema = z.object({
  items: z.array(scheduleItemSchema).max(50),
});

const speakerSchema = z.object({
  name: z.string().min(1).max(100),
  title: z.string().min(1).max(100),
  company: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  imageUrl: z.string().url().optional(),
});

const speakersDataSchema = z.object({
  speakers: z.array(speakerSchema).max(30),
});

const locationDataSchema = z.object({
  venue: z.string().min(1).max(200),
  address: z.string().min(1).max(500),
  mapEmbedUrl: z.string().url().optional(),
});

const faqItemSchema = z.object({
  question: z.string().min(1).max(300),
  answer: z.string().min(1).max(2000),
});

const faqDataSchema = z.object({
  items: z.array(faqItemSchema).max(30),
});

const websiteSectionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("hero"), enabled: z.boolean(), data: heroDataSchema }),
  z.object({ type: z.literal("about"), enabled: z.boolean(), data: aboutDataSchema }),
  z.object({ type: z.literal("schedule"), enabled: z.boolean(), data: scheduleDataSchema }),
  z.object({ type: z.literal("speakers"), enabled: z.boolean(), data: speakersDataSchema }),
  z.object({ type: z.literal("location"), enabled: z.boolean(), data: locationDataSchema }),
  z.object({ type: z.literal("faq"), enabled: z.boolean(), data: faqDataSchema }),
]);

const themeSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color"),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color"),
  backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color"),
  fontFamily: z.enum(["inter", "system"]),
});

export const websiteConfigSchema = z.object({
  theme: themeSchema,
  sections: z.array(websiteSectionSchema).min(1).max(6),
});

export const saveWebsiteConfigSchema = z.object({
  eventId: z.string().uuid(),
  config: websiteConfigSchema,
});

export const generateWebsiteConfigSchema = z.object({
  eventId: z.string().uuid(),
});

export type SaveWebsiteConfigInput = z.infer<typeof saveWebsiteConfigSchema>;
export type GenerateWebsiteConfigInput = z.infer<typeof generateWebsiteConfigSchema>;
