import type { BadgeConfig, BadgeField } from "@/types";

function field(
  id: string,
  type: BadgeField["type"],
  fontSize: number,
  fontWeight: BadgeField["fontWeight"],
  x: number,
  y: number,
  textAlign: BadgeField["textAlign"],
  color?: string
): BadgeField {
  return { id, type, fontSize, fontWeight, x, y, textAlign, color };
}

const base = { width: 288, height: 216, showQrCode: true } as const;

export const BADGE_PRESETS: Record<BadgeConfig["preset"], BadgeConfig> = {
  minimal: {
    ...base,
    preset: "minimal",
    backgroundColor: "#FFFFFF",
    textColor: "#1a1a1a",
    accentColor: "#6366f1",
    fields: [
      field("f1", "fullName", 22, "bold", 144, 70, "center"),
      field("f2", "company", 12, "normal", 144, 98, "center"),
      field("f3", "ticketType", 10, "normal", 144, 118, "center", "#6366f1"),
    ],
    qrCodePosition: "bottom-right",
    qrCodeSize: 56,
  },
  corporate: {
    ...base,
    preset: "corporate",
    backgroundColor: "#f8fafc",
    textColor: "#0f172a",
    accentColor: "#0369a1",
    fields: [
      field("f1", "firstName", 24, "bold", 20, 55, "left"),
      field("f2", "lastName", 24, "bold", 20, 82, "left"),
      field("f3", "jobTitle", 11, "normal", 20, 108, "left"),
      field("f4", "company", 13, "bold", 20, 125, "left"),
    ],
    qrCodePosition: "bottom-right",
    qrCodeSize: 60,
  },
  bold: {
    ...base,
    preset: "bold",
    backgroundColor: "#18181b",
    textColor: "#ffffff",
    accentColor: "#f59e0b",
    fields: [
      field("f1", "fullName", 26, "bold", 144, 65, "center"),
      field("f2", "company", 14, "normal", 144, 96, "center", "#f59e0b"),
      field("f3", "ticketType", 10, "bold", 144, 116, "center", "#a1a1aa"),
    ],
    qrCodePosition: "bottom-center",
    qrCodeSize: 52,
  },
  modern: {
    ...base,
    preset: "modern",
    backgroundColor: "#faf5ff",
    textColor: "#3b0764",
    accentColor: "#a855f7",
    fields: [
      field("f1", "firstName", 28, "bold", 144, 55, "center"),
      field("f2", "lastName", 16, "normal", 144, 82, "center"),
      field("f3", "jobTitle", 11, "normal", 144, 104, "center", "#a855f7"),
      field("f4", "company", 11, "normal", 144, 120, "center"),
    ],
    qrCodePosition: "bottom-left",
    qrCodeSize: 54,
  },
};

export const PRESET_NAMES: Record<BadgeConfig["preset"], string> = {
  minimal: "Minimal",
  corporate: "Corporate",
  bold: "Bold",
  modern: "Modern",
};
