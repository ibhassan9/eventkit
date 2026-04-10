export function generateGoogleCalendarUrl(params: {
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  description?: string;
}): string {
  const formatDate = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", params.title);
  url.searchParams.set(
    "dates",
    `${formatDate(params.startDate)}/${formatDate(params.endDate)}`
  );
  if (params.location) url.searchParams.set("location", params.location);
  if (params.description) url.searchParams.set("details", params.description);

  return url.toString();
}

export function generateICSContent(params: {
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  description?: string;
}): string {
  const formatDate = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EventKit//EN",
    "BEGIN:VEVENT",
    `DTSTART:${formatDate(params.startDate)}`,
    `DTEND:${formatDate(params.endDate)}`,
    `SUMMARY:${params.title}`,
  ];

  if (params.location) lines.push(`LOCATION:${params.location}`);
  if (params.description) lines.push(`DESCRIPTION:${params.description}`);

  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}
