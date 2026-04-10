import type { BadgeConfig, BadgeField } from "@/types";

export interface PdfAttendee {
  firstName: string;
  lastName: string;
  company: string | null;
  jobTitle: string | null;
  qrCode: string;
  ticketType?: { name: string } | null;
}

export interface PdfEvent {
  name: string;
}

export function getFieldValue(field: BadgeField, attendee: PdfAttendee): string {
  switch (field.type) {
    case "firstName":
      return attendee.firstName;
    case "lastName":
      return attendee.lastName;
    case "fullName":
      return `${attendee.firstName} ${attendee.lastName}`;
    case "company":
      return attendee.company ?? "";
    case "jobTitle":
      return attendee.jobTitle ?? "";
    case "ticketType":
      return attendee.ticketType?.name ?? "";
    case "custom":
      return field.label ?? "";
  }
}

export function getQrPosition(
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
