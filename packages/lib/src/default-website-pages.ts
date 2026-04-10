import type { WebsitePages } from "@eventkit/types";

export function defaultWebsitePages(): WebsitePages {
  return {
    pages: {
      home: {
        visible: true,
        title: "Home",
        sections: {
          hero: true,
          about: true,
          location: true,
          faq: true,
        },
      },
      schedule: {
        visible: true,
        title: "Schedule",
      },
      speakers: {
        visible: true,
        title: "Speakers",
      },
    },
    settings: {
      theme: {
        primaryColor: "#7C3AED",
        accentColor: "#F59E0B",
        fontFamily: "inter",
      },
      meta: {
        title: "",
        description: "",
        ogImage: "",
      },
      registration: {
        ctaText: "Register Now",
        ctaPosition: "nav",
      },
      navbar: {
        style: "sticky",
        showLogo: true,
      },
      footer: {
        showOrganizer: true,
        customText: "",
      },
    },
  };
}
