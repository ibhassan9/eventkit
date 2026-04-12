import type { BadgeConfigV2, BadgeElement } from "@eventkit/types";

function el(overrides: Partial<BadgeElement> & Pick<BadgeElement, "id" | "type">): BadgeElement {
  return {
    x: 0,
    y: 0,
    width: 100,
    height: 40,
    rotation: 0,
    zIndex: 0,
    locked: false,
    visible: true,
    ...overrides,
  };
}

const BASE: Pick<BadgeConfigV2, "version" | "width" | "height" | "dpi"> = {
  version: 2,
  width: 4,
  height: 3,
  dpi: 300,
};

// Canvas dimensions at 150 DPI: 600 x 450

export const STARTER_TEMPLATES: Record<string, BadgeConfigV2> = {
  blank: {
    ...BASE,
    backgroundColor: "#FFFFFF",
    elements: [],
  },

  corporate: {
    ...BASE,
    backgroundColor: "#FFFFFF",
    elements: [
      // Violet header band
      el({
        id: "corp-band",
        type: "shape",
        x: 0,
        y: 0,
        width: 600,
        height: 60,
        zIndex: 0,
        shapeType: "rect",
        fill: "#7c3aed",
      }),
      // Full name on the band
      el({
        id: "corp-name",
        type: "text",
        x: 20,
        y: 16,
        width: 560,
        height: 36,
        zIndex: 1,
        mergeField: "{{fullName}}",
        fontSize: 24,
        fontWeight: 700,
        fontColor: "#FFFFFF",
        fontFamily: "Inter",
        textAlign: "center",
      }),
      // Job title
      el({
        id: "corp-title",
        type: "text",
        x: 20,
        y: 80,
        width: 560,
        height: 24,
        zIndex: 2,
        mergeField: "{{jobTitle}}",
        fontSize: 16,
        fontWeight: 400,
        fontColor: "#78716c",
        fontFamily: "Inter",
        textAlign: "center",
      }),
      // Company
      el({
        id: "corp-company",
        type: "text",
        x: 20,
        y: 110,
        width: 560,
        height: 28,
        zIndex: 3,
        mergeField: "{{company}}",
        fontSize: 18,
        fontWeight: 600,
        fontColor: "#44403c",
        fontFamily: "Inter",
        textAlign: "center",
      }),
      // QR code
      el({
        id: "corp-qr",
        type: "qr",
        x: 500,
        y: 350,
        width: 80,
        height: 80,
        zIndex: 4,
        qrForeground: "#000000",
        qrBackground: "#FFFFFF",
      }),
    ],
  },

  conference: {
    ...BASE,
    backgroundColor: "#FFFFFF",
    elements: [
      // First name large
      el({
        id: "conf-first",
        type: "text",
        x: 30,
        y: 40,
        width: 400,
        height: 50,
        zIndex: 0,
        mergeField: "{{firstName}}",
        fontSize: 36,
        fontWeight: 700,
        fontColor: "#1c1917",
        fontFamily: "Inter",
        textAlign: "left",
      }),
      // Last name
      el({
        id: "conf-last",
        type: "text",
        x: 30,
        y: 90,
        width: 400,
        height: 38,
        zIndex: 1,
        mergeField: "{{lastName}}",
        fontSize: 28,
        fontWeight: 400,
        fontColor: "#57534e",
        fontFamily: "Inter",
        textAlign: "left",
      }),
      // Company
      el({
        id: "conf-company",
        type: "text",
        x: 30,
        y: 140,
        width: 400,
        height: 24,
        zIndex: 2,
        mergeField: "{{company}}",
        fontSize: 16,
        fontWeight: 400,
        fontColor: "#a8a29e",
        fontFamily: "Inter",
        textAlign: "left",
      }),
      // Ticket type pill background
      el({
        id: "conf-pill",
        type: "shape",
        x: 440,
        y: 30,
        width: 140,
        height: 32,
        zIndex: 3,
        shapeType: "roundedRect",
        fill: "#f3e8ff",
        cornerRadius: 16,
      }),
      // Ticket type text
      el({
        id: "conf-ticket",
        type: "text",
        x: 440,
        y: 36,
        width: 140,
        height: 24,
        zIndex: 4,
        mergeField: "{{ticketType}}",
        fontSize: 12,
        fontWeight: 600,
        fontColor: "#7c3aed",
        fontFamily: "Inter",
        textAlign: "center",
      }),
      // QR code
      el({
        id: "conf-qr",
        type: "qr",
        x: 20,
        y: 360,
        width: 70,
        height: 70,
        zIndex: 5,
        qrForeground: "#000000",
        qrBackground: "#FFFFFF",
      }),
    ],
  },

  minimal: {
    ...BASE,
    backgroundColor: "#FFFFFF",
    elements: [
      // Full name
      el({
        id: "min-name",
        type: "text",
        x: 20,
        y: 140,
        width: 560,
        height: 40,
        zIndex: 0,
        mergeField: "{{fullName}}",
        fontSize: 28,
        fontWeight: 600,
        fontColor: "#1c1917",
        fontFamily: "Inter",
        textAlign: "center",
      }),
      // Company
      el({
        id: "min-company",
        type: "text",
        x: 20,
        y: 185,
        width: 560,
        height: 24,
        zIndex: 1,
        mergeField: "{{company}}",
        fontSize: 16,
        fontWeight: 400,
        fontColor: "#a8a29e",
        fontFamily: "Inter",
        textAlign: "center",
      }),
      // Divider
      el({
        id: "min-divider",
        type: "line",
        x: 200,
        y: 225,
        width: 200,
        height: 1,
        zIndex: 2,
        stroke: "#e7e5e4",
        strokeWidth: 1,
      }),
      // QR code
      el({
        id: "min-qr",
        type: "qr",
        x: 270,
        y: 260,
        width: 60,
        height: 60,
        zIndex: 3,
        qrForeground: "#000000",
        qrBackground: "#FFFFFF",
      }),
    ],
  },
};
