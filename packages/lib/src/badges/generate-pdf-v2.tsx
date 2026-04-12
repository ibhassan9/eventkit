import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { BadgeConfigV2, BadgeElement } from "@eventkit/types";
import { generateQRCode } from "../qr";
import { resolveMergeField, type PdfAttendee, type PdfEvent } from "./badge-helpers";

// Register Google Fonts for PDF rendering
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hiA.woff2",
      fontWeight: 500,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hiA.woff2",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hiA.woff2",
      fontWeight: 700,
    },
  ],
});

/**
 * Scale factor to convert canvas pixels (at 150 DPI) to PDF points (72 pt/inch).
 * 72 / 150 = 0.48
 */
const PX_TO_PT = 72 / 150;

function renderElement(
  el: BadgeElement,
  attendee: PdfAttendee,
  qrDataUrl: string | null
): React.ReactElement | null {
  if (el.visible === false) return null;

  const baseStyle = {
    position: "absolute" as const,
    left: el.x * PX_TO_PT,
    top: el.y * PX_TO_PT,
    width: el.width * PX_TO_PT,
    height: el.height * PX_TO_PT,
    ...(el.rotation ? { transform: `rotate(${el.rotation}deg)` } : {}),
  };

  switch (el.type) {
    case "text": {
      const content = el.mergeField
        ? resolveMergeField(el.mergeField, attendee)
        : (el.text ?? "");
      return (
        <Text
          key={el.id}
          style={{
            ...baseStyle,
            fontSize: (el.fontSize ?? 16) * PX_TO_PT,
            fontWeight: el.fontWeight ?? 400,
            color: el.fontColor ?? "#000000",
            textAlign: el.textAlign ?? "left",
            fontFamily: el.fontFamily ?? "Inter",
            lineHeight: el.lineHeight ?? 1.2,
            letterSpacing: el.letterSpacing
              ? el.letterSpacing * PX_TO_PT
              : undefined,
          }}
        >
          {content}
        </Text>
      );
    }

    case "image": {
      if (!el.src) return null;
      return (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image
          key={el.id}
          src={el.src}
          style={{
            ...baseStyle,
            opacity: el.opacity ?? 1,
            borderRadius: el.cornerRadius
              ? el.cornerRadius * PX_TO_PT
              : 0,
          }}
        />
      );
    }

    case "qr": {
      if (!qrDataUrl) return null;
      return (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image
          key={el.id}
          src={qrDataUrl}
          style={baseStyle}
        />
      );
    }

    case "shape": {
      return (
        <View
          key={el.id}
          style={{
            ...baseStyle,
            backgroundColor: el.fill ?? "transparent",
            borderColor: el.stroke ?? "transparent",
            borderWidth: el.strokeWidth ? el.strokeWidth * PX_TO_PT : 0,
            borderRadius: el.cornerRadius
              ? el.cornerRadius * PX_TO_PT
              : el.shapeType === "circle"
                ? (el.width * PX_TO_PT) / 2
                : 0,
            opacity: el.opacity ?? 1,
          }}
        />
      );
    }

    case "line": {
      return (
        <View
          key={el.id}
          style={{
            position: "absolute",
            left: el.x * PX_TO_PT,
            top: el.y * PX_TO_PT,
            width: el.width * PX_TO_PT,
            height: 0,
            borderBottomWidth: (el.strokeWidth ?? 1) * PX_TO_PT,
            borderBottomColor: el.stroke ?? "#d6d3d1",
            borderBottomStyle: el.dashPattern ? "dashed" : "solid",
            ...(el.rotation
              ? { transform: `rotate(${el.rotation}deg)` }
              : {}),
          }}
        />
      );
    }

    default:
      return null;
  }
}

function BadgePageV2({
  config,
  attendee,
  qrDataUrl,
}: {
  config: BadgeConfigV2;
  attendee: PdfAttendee;
  qrDataUrl: string | null;
}) {
  const widthPt = config.width * 72;
  const heightPt = config.height * 72;

  const sortedElements = [...config.elements]
    .filter((el) => el.visible !== false)
    .sort((a, b) => a.zIndex - b.zIndex);

  return (
    <Page size={[widthPt, heightPt]}>
      <View
        style={{
          width: widthPt,
          height: heightPt,
          backgroundColor: config.backgroundColor,
          position: "relative",
        }}
      >
        {sortedElements.map((el) => renderElement(el, attendee, qrDataUrl))}
      </View>
    </Page>
  );
}

export async function generateBadgePdfV2(
  config: BadgeConfigV2,
  attendees: PdfAttendee[],
  _event: PdfEvent
): Promise<Buffer> {
  // Generate QR codes for all attendees
  const hasQrElement = config.elements.some((el) => el.type === "qr");
  const qrCodes = hasQrElement
    ? await Promise.all(
        attendees.map((a) => {
          const qrEl = config.elements.find((el) => el.type === "qr");
          return generateQRCode(a.qrCode);
        })
      )
    : attendees.map(() => null);

  const doc = (
    <Document>
      {attendees.map((attendee, index) => (
        <BadgePageV2
          key={attendee.qrCode}
          config={config}
          attendee={attendee}
          qrDataUrl={qrCodes[index]}
        />
      ))}
    </Document>
  );

  return renderToBuffer(doc);
}
