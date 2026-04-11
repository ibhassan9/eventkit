import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amountInCents: number,
  currency: string = "CAD"
): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountInCents / 100);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function formatDate(
  date: Date | string,
  timezone?: string
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone ?? "UTC",
  }).format(d);
}

export function formatDateRange(
  start: Date | string,
  end: Date | string,
  timezone?: string
): string {
  const s = typeof start === "string" ? new Date(start) : start;
  const e = typeof end === "string" ? new Date(end) : end;
  const tz = timezone ?? "UTC";

  const sameDay =
    s.toLocaleDateString("en-CA", { timeZone: tz }) ===
    e.toLocaleDateString("en-CA", { timeZone: tz });

  if (sameDay) {
    const datePart = new Intl.DateTimeFormat("en-CA", {
      dateStyle: "medium",
      timeZone: tz,
    }).format(s);
    const startTime = new Intl.DateTimeFormat("en-CA", {
      timeStyle: "short",
      timeZone: tz,
    }).format(s);
    const endTime = new Intl.DateTimeFormat("en-CA", {
      timeStyle: "short",
      timeZone: tz,
    }).format(e);
    return `${datePart}, ${startTime} - ${endTime}`;
  }

  return `${formatDate(s, tz)} - ${formatDate(e, tz)}`;
}

const TEMP_PASSWORD_WORDS = [
  "maple",  "river",  "ocean",  "spark",  "cedar",  "frost",  "coral",
  "blaze",  "drift",  "grove",  "lunar",  "pearl",  "stone",  "swift",
  "ember",  "haven",  "ridge",  "delta",  "flint",  "aspen",  "birch",
  "cloud",  "dune",   "fern",   "gale",   "iris",   "jade",   "lark",
  "mint",   "nest",   "opal",   "pine",   "quay",   "reed",   "sage",
  "tide",   "vale",   "wren",   "amber",  "brook",  "crest",  "dusk",
];

export function generateTemporaryPassword(): string {
  const w1 = TEMP_PASSWORD_WORDS[Math.floor(Math.random() * TEMP_PASSWORD_WORDS.length)];
  const w2 = TEMP_PASSWORD_WORDS[Math.floor(Math.random() * TEMP_PASSWORD_WORDS.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${w1}-${w2}-${num}`;
}
