export function groupSessionsByDate<
  T extends { startTime: Date },
>(sessions: T[], timezone: string): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  for (const session of sessions) {
    const dateKey = session.startTime.toLocaleDateString("en-CA", {
      timeZone: timezone,
    });
    const existing = grouped.get(dateKey);
    if (existing) {
      existing.push(session);
    } else {
      grouped.set(dateKey, [session]);
    }
  }

  return grouped;
}
