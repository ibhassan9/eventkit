import type { WebsiteConfig } from "@eventkit/types";

export function defaultWebsiteConfig(eventName: string): WebsiteConfig {
  return {
    theme: {
      primaryColor: "#1a1a2e",
      secondaryColor: "#6366f1",
      backgroundColor: "#ffffff",
      fontFamily: "inter",
    },
    sections: [
      {
        type: "hero",
        enabled: true,
        data: {
          title: eventName,
          subtitle: "Join us for an unforgettable experience",
          ctaText: "Register Now",
        },
      },
      {
        type: "about",
        enabled: true,
        data: { content: "Tell your attendees what this event is about." },
      },
      {
        type: "schedule",
        enabled: false,
        data: { items: [] },
      },
      {
        type: "speakers",
        enabled: false,
        data: { speakers: [] },
      },
      {
        type: "location",
        enabled: false,
        data: { venue: "", address: "" },
      },
      {
        type: "faq",
        enabled: false,
        data: { items: [] },
      },
    ],
  };
}
