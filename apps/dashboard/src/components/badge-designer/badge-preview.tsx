"use client";

import type { BadgeConfig, BadgeField } from "@eventkit/types";

interface BadgePreviewProps {
  config: BadgeConfig;
}

const SAMPLE_DATA: Record<string, string> = {
  firstName: "Jane",
  lastName: "Smith",
  fullName: "Jane Smith",
  company: "Acme Corp",
  jobTitle: "Software Engineer",
  ticketType: "VIP",
  custom: "Custom Field",
};

function getQrPosition(
  position: BadgeConfig["qrCodePosition"],
  size: number,
  width: number,
  height: number
): { left: number; top: number } {
  const padding = 12;
  const top = height - size - padding;
  switch (position) {
    case "bottom-left":
      return { left: padding, top };
    case "bottom-center":
      return { left: (width - size) / 2, top };
    case "bottom-right":
      return { left: width - size - padding, top };
  }
}

function FieldLabel({ field, textColor }: { field: BadgeField; textColor: string }) {
  const value = SAMPLE_DATA[field.type] ?? field.label ?? "";

  return (
    <div
      style={{
        position: "absolute",
        left: `${field.x}pt`,
        top: `${field.y}pt`,
        fontSize: `${field.fontSize}pt`,
        fontWeight: field.fontWeight,
        color: field.color ?? textColor,
        textAlign: field.textAlign,
        transform:
          field.textAlign === "center"
            ? "translateX(-50%)"
            : field.textAlign === "right"
              ? "translateX(-100%)"
              : undefined,
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </div>
  );
}

export function BadgePreview({ config }: BadgePreviewProps) {
  const scale = 2;
  const qrPos = config.showQrCode
    ? getQrPosition(
        config.qrCodePosition,
        config.qrCodeSize,
        config.width,
        config.height
      )
    : null;

  return (
    <div
      className="flex items-center justify-center rounded-lg border bg-stone-100 p-6"
      style={{
        minHeight: `${config.height * scale + 48}px`,
      }}
    >
      <div
        style={{
          width: `${config.width}px`,
          height: `${config.height}px`,
          backgroundColor: config.backgroundColor,
          color: config.textColor,
          position: "relative",
          overflow: "hidden",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6pt",
            backgroundColor: config.accentColor,
          }}
        />

        {config.fields.map((field) => (
          <FieldLabel key={field.id} field={field} textColor={config.textColor} />
        ))}

        {config.showQrCode && qrPos && (
          <div
            style={{
              position: "absolute",
              left: `${qrPos.left}pt`,
              top: `${qrPos.top}pt`,
              width: `${config.qrCodeSize}pt`,
              height: `${config.qrCodeSize}pt`,
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
            }}
          >
            <svg viewBox="0 0 100 100" width="80%" height="80%">
              <rect x="10" y="10" width="25" height="25" fill="#000" />
              <rect x="65" y="10" width="25" height="25" fill="#000" />
              <rect x="10" y="65" width="25" height="25" fill="#000" />
              <rect x="40" y="40" width="20" height="20" fill="#000" />
              <rect x="65" y="65" width="10" height="10" fill="#000" />
              <rect x="80" y="80" width="10" height="10" fill="#000" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
