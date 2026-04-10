import type { MergeTag } from "@/types";

export const MERGE_TAGS: MergeTag[] = [
  { key: "firstName", label: "First Name", sample: "Jane" },
  { key: "lastName", label: "Last Name", sample: "Smith" },
  { key: "eventName", label: "Event Name", sample: "Tech Conference 2026" },
  {
    key: "eventDate",
    label: "Event Date",
    sample: "Apr 15, 2026, 9:00 a.m.",
  },
  { key: "ticketType", label: "Ticket Type", sample: "General Admission" },
  { key: "qrCode", label: "QR Code", sample: "[QR Code]" },
];

export function getMergeTagSampleValues(): Record<string, string> {
  const values: Record<string, string> = {};
  for (const tag of MERGE_TAGS) {
    values[tag.key] = tag.sample;
  }
  return values;
}
