import sanitizeHtml from "sanitize-html";
import { formatDate } from "../utils";

interface EmailAttendee {
  firstName: string;
  lastName: string;
  qrCode: string;
  ticketType?: { name: string } | null;
}

interface EmailEvent {
  name: string;
  startDate: Date | string;
  timezone: string;
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "p", "br", "hr", "strong", "em", "u", "a",
    "ul", "ol", "li", "img", "span", "div", "blockquote",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "width", "height", "style"],
    span: ["class", "style", "data-type", "data-id"],
    div: ["style", "class"],
    p: ["style"],
    h1: ["style"],
    h2: ["style"],
    h3: ["style"],
  },
  allowedStyles: {
    "*": {
      "text-align": [/^left$/, /^right$/, /^center$/],
      color: [/^#[0-9a-fA-F]{3,6}$/],
      "background-color": [/^#[0-9a-fA-F]{3,6}$/],
      "font-size": [/^\d+(?:px|em|rem)$/],
      padding: [/^\d+(?:px|em|rem)/],
      margin: [/^\d+(?:px|em|rem)/],
    },
  },
};

function buildMergeValues(
  attendee: EmailAttendee,
  event: EmailEvent
): Record<string, string> {
  return {
    firstName: attendee.firstName,
    lastName: attendee.lastName,
    eventName: event.name,
    eventDate: formatDate(event.startDate, event.timezone),
    ticketType: attendee.ticketType?.name ?? "General",
    qrCode: attendee.qrCode,
  };
}

export function renderEmailHtml(
  templateBody: string,
  attendee: EmailAttendee,
  event: EmailEvent
): string {
  const values = buildMergeValues(attendee, event);
  let html = templateBody;

  for (const [key, value] of Object.entries(values)) {
    const tagPattern = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    html = html.replace(tagPattern, value);
  }

  return sanitizeHtml(html, SANITIZE_OPTIONS);
}

export function renderSubject(
  subject: string,
  attendee: EmailAttendee,
  event: EmailEvent
): string {
  const values = buildMergeValues(attendee, event);
  let result = subject;

  for (const [key, value] of Object.entries(values)) {
    const tagPattern = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(tagPattern, value);
  }

  return result;
}
