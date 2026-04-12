import type {
  BadgeConfigV1,
  BadgeConfigV2,
  BadgeElement,
  BadgeField,
  AnyBadgeConfig,
} from "@eventkit/types";

function isV2(config: AnyBadgeConfig): config is BadgeConfigV2 {
  return "version" in config && config.version === 2;
}

function mapFieldToMergeField(
  fieldType: BadgeField["type"]
): string | undefined {
  const map: Record<string, string> = {
    firstName: "{{firstName}}",
    lastName: "{{lastName}}",
    fullName: "{{fullName}}",
    company: "{{company}}",
    jobTitle: "{{jobTitle}}",
    ticketType: "{{ticketType}}",
  };
  return map[fieldType];
}

function getQrPosition(
  position: BadgeConfigV1["qrCodePosition"],
  size: number,
  width: number,
  height: number
): { x: number; y: number } {
  const padding = 12;
  const top = height - size - padding;
  switch (position) {
    case "bottom-left":
      return { x: padding, y: top };
    case "bottom-center":
      return { x: (width - size) / 2, y: top };
    case "bottom-right":
      return { x: width - size - padding, y: top };
  }
}

/**
 * Convert points to pixels at 150 DPI preview resolution.
 * PDF points are 72 per inch, canvas pixels are 150 per inch.
 */
function ptToPx(pt: number): number {
  return (pt / 72) * 150;
}

export function migrateBadgeConfig(config: AnyBadgeConfig): BadgeConfigV2 {
  if (isV2(config)) return config;

  const v1 = config as BadgeConfigV1;
  const widthInches = v1.width / 72;
  const heightInches = v1.height / 72;
  const canvasW = widthInches * 150;
  const canvasH = heightInches * 150;

  const elements: BadgeElement[] = [];
  let zIndex = 0;

  // Accent color bar at top
  elements.push({
    id: "migrated-accent-bar",
    type: "shape",
    x: 0,
    y: 0,
    width: canvasW,
    height: ptToPx(6),
    rotation: 0,
    zIndex: zIndex++,
    locked: false,
    visible: true,
    shapeType: "rect",
    fill: v1.accentColor,
  });

  // Convert fields
  for (const field of v1.fields) {
    const mergeField = mapFieldToMergeField(field.type);
    const fontSize = ptToPx(field.fontSize);
    const x = ptToPx(field.x);
    const y = ptToPx(field.y);

    elements.push({
      id: `migrated-${field.id}`,
      type: "text",
      x,
      y,
      width: canvasW * 0.8,
      height: fontSize * 1.5,
      rotation: 0,
      zIndex: zIndex++,
      locked: false,
      visible: true,
      text: field.type === "custom" ? (field.label ?? "Custom") : undefined,
      mergeField,
      fontFamily: "Inter",
      fontSize,
      fontWeight: field.fontWeight === "bold" ? 700 : 400,
      fontColor: field.color ?? v1.textColor,
      textAlign: field.textAlign,
    });
  }

  // QR code
  if (v1.showQrCode) {
    const qrSizePx = ptToPx(v1.qrCodeSize);
    const pos = getQrPosition(
      v1.qrCodePosition,
      qrSizePx,
      canvasW,
      canvasH
    );
    elements.push({
      id: "migrated-qr",
      type: "qr",
      x: pos.x,
      y: pos.y,
      width: qrSizePx,
      height: qrSizePx,
      rotation: 0,
      zIndex: zIndex++,
      locked: false,
      visible: true,
      qrForeground: "#000000",
      qrBackground: "#FFFFFF",
    });
  }

  return {
    version: 2,
    width: widthInches,
    height: heightInches,
    dpi: 300,
    backgroundColor: v1.backgroundColor,
    elements,
  };
}
