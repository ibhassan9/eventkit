import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { BadgeConfig } from "@/types";
import { generateQRCode } from "@/lib/qr";
import {
  getFieldValue,
  getQrPosition,
  type PdfAttendee,
  type PdfEvent,
} from "./badge-helpers";

function BadgePage({
  config,
  attendee,
  qrDataUrl,
}: {
  config: BadgeConfig;
  attendee: PdfAttendee;
  qrDataUrl: string | null;
}) {
  const qrPos = config.showQrCode
    ? getQrPosition(config.qrCodePosition, config.qrCodeSize, config.width, config.height)
    : null;

  return (
    <Page size={[config.width, config.height]}>
      <View
        style={{
          width: config.width,
          height: config.height,
          backgroundColor: config.backgroundColor,
          position: "relative",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 6,
            backgroundColor: config.accentColor,
          }}
        />

        {config.fields.map((field) => {
          const value = getFieldValue(field, attendee);
          if (!value) return null;
          const isCenterOrRight = field.textAlign === "center" || field.textAlign === "right";

          return (
            <Text
              key={field.id}
              style={{
                position: "absolute",
                left: isCenterOrRight ? 0 : field.x,
                top: field.y,
                width: isCenterOrRight ? config.width : undefined,
                fontSize: field.fontSize,
                fontWeight: field.fontWeight === "bold" ? 700 : 400,
                color: field.color ?? config.textColor,
                textAlign: field.textAlign,
              }}
            >
              {value}
            </Text>
          );
        })}

        {config.showQrCode && qrPos && qrDataUrl && (
          // eslint-disable-next-line jsx-a11y/alt-text
          <Image
            src={qrDataUrl}
            style={{
              position: "absolute",
              left: qrPos.left,
              top: qrPos.top,
              width: config.qrCodeSize,
              height: config.qrCodeSize,
            }}
          />
        )}
      </View>
    </Page>
  );
}

export async function generateBadgePdf(
  config: BadgeConfig,
  attendees: PdfAttendee[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _event: PdfEvent
): Promise<Buffer> {
  const qrCodes = await Promise.all(
    attendees.map((a) => generateQRCode(a.qrCode))
  );

  const doc = (
    <Document>
      {attendees.map((attendee, index) => (
        <BadgePage
          key={attendee.qrCode}
          config={config}
          attendee={attendee}
          qrDataUrl={config.showQrCode ? qrCodes[index] : null}
        />
      ))}
    </Document>
  );

  return renderToBuffer(doc);
}
