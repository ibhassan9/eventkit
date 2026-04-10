export const queryKeys = {
  events: {
    all: ["events"] as const,
    list: () => [...queryKeys.events.all, "list"] as const,
    detail: (eventId: string) =>
      [...queryKeys.events.all, "detail", eventId] as const,
    withStats: (eventId: string) =>
      [...queryKeys.events.all, "withStats", eventId] as const,
  },
  attendees: {
    all: ["attendees"] as const,
    list: (
      eventId: string,
      filters?: Record<string, string | number | boolean | undefined>
    ) => [...queryKeys.attendees.all, "list", eventId, filters] as const,
  },
  checkin: {
    all: ["checkin"] as const,
    dashboard: (eventId: string) =>
      [...queryKeys.checkin.all, "dashboard", eventId] as const,
  },
  ticketTypes: {
    all: ["ticketTypes"] as const,
    list: (eventId: string) =>
      [...queryKeys.ticketTypes.all, "list", eventId] as const,
  },
  emailTemplates: {
    all: ["emailTemplates"] as const,
    list: (eventId: string) =>
      [...queryKeys.emailTemplates.all, "list", eventId] as const,
  },
  badgeTemplates: {
    all: ["badgeTemplates"] as const,
    list: (eventId: string) =>
      [...queryKeys.badgeTemplates.all, "list", eventId] as const,
  },
  organization: {
    all: ["organization"] as const,
    current: () => [...queryKeys.organization.all, "current"] as const,
  },
  websiteConfig: {
    all: ["websiteConfig"] as const,
    detail: (eventId: string) =>
      [...queryKeys.websiteConfig.all, "detail", eventId] as const,
  },
  registrationConfig: {
    all: ["registrationConfig"] as const,
    detail: (eventId: string) =>
      [...queryKeys.registrationConfig.all, "detail", eventId] as const,
  },
};
