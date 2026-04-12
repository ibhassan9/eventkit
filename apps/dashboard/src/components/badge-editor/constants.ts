export const PREVIEW_DPI = 150;

export const BADGE_DEFAULTS = { width: 4, height: 3 };

export const FONT_LIST = [
  "Inter",
  "Figtree",
  "Plus Jakarta Sans",
  "DM Sans",
  "Roboto",
  "Roboto Mono",
] as const;

export const BADGE_SIZES = [
  { label: "Standard 4×3", width: 4, height: 3 },
  { label: "Large 6×4", width: 6, height: 4 },
  { label: "Small 3.5×2", width: 3.5, height: 2 },
  { label: "Square 3×3", width: 3, height: 3 },
] as const;

export const SAMPLE_ATTENDEE: Record<string, string> = {
  "{{firstName}}": "Sarah",
  "{{lastName}}": "Chen",
  "{{fullName}}": "Sarah Chen",
  "{{email}}": "sarah.chen@example.com",
  "{{company}}": "Shopify",
  "{{jobTitle}}": "VP Engineering",
  "{{ticketType}}": "General Admission",
};

export const MERGE_FIELDS = [
  { value: "{{firstName}}", label: "First Name", preview: "Sarah" },
  { value: "{{lastName}}", label: "Last Name", preview: "Chen" },
  { value: "{{fullName}}", label: "Full Name", preview: "Sarah Chen" },
  {
    value: "{{email}}",
    label: "Email",
    preview: "sarah.chen@example.com",
  },
  { value: "{{company}}", label: "Company", preview: "Shopify" },
  {
    value: "{{jobTitle}}",
    label: "Job Title",
    preview: "VP Engineering",
  },
  {
    value: "{{ticketType}}",
    label: "Ticket Type",
    preview: "General Admission",
  },
] as const;

/** Convert badge inches to canvas pixels at preview DPI */
export function inchesToPx(inches: number): number {
  return inches * PREVIEW_DPI;
}
