export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface WebsiteConfig {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    fontFamily: "inter" | "system";
  };
  sections: WebsiteSection[];
}

export type WebsiteSection =
  | { type: "hero"; enabled: boolean; data: HeroData }
  | { type: "about"; enabled: boolean; data: AboutData }
  | { type: "schedule"; enabled: boolean; data: ScheduleData }
  | { type: "speakers"; enabled: boolean; data: SpeakersData }
  | { type: "location"; enabled: boolean; data: LocationData }
  | { type: "faq"; enabled: boolean; data: FaqData };

export interface HeroData {
  title: string;
  subtitle: string;
  ctaText: string;
  backgroundImageUrl?: string;
}

export interface AboutData {
  content: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
  speaker?: string;
}

export interface ScheduleData {
  items: ScheduleItem[];
}

export interface Speaker {
  name: string;
  title: string;
  company?: string;
  bio?: string;
  imageUrl?: string;
}

export interface SpeakersData {
  speakers: Speaker[];
}

export interface LocationData {
  venue: string;
  address: string;
  mapEmbedUrl?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqData {
  items: FaqItem[];
}

export interface CustomField {
  id: string;
  type: "text" | "textarea" | "select" | "checkbox" | "radio";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  order: number;
}

export interface RegistrationConfig {
  fields: CustomField[];
}

export interface BadgeField {
  id: string;
  type: "firstName" | "lastName" | "fullName" | "company" | "jobTitle" | "ticketType" | "custom";
  label?: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  color?: string;
  x: number;
  y: number;
  textAlign: "left" | "center" | "right";
}

export interface BadgeConfig {
  width: number;
  height: number;
  preset: "minimal" | "corporate" | "bold" | "modern";
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fields: BadgeField[];
  showQrCode: boolean;
  qrCodePosition: "bottom-right" | "bottom-left" | "bottom-center";
  qrCodeSize: number;
  logoUrl?: string;
}

export interface MergeTag {
  key: string;
  label: string;
  sample: string;
}

export type SpeakerRole = "speaker" | "moderator" | "panelist";

export interface WebsitePages {
  pages: {
    home: {
      visible: true;
      title: string;
      sections: {
        hero: boolean;
        about: boolean;
        location: boolean;
        faq: boolean;
      };
    };
    schedule: {
      visible: boolean;
      title: string;
    };
    speakers: {
      visible: boolean;
      title: string;
    };
  };
  settings: {
    theme: {
      primaryColor: string;
      accentColor: string;
      fontFamily: string;
    };
    meta: {
      title: string;
      description: string;
      ogImage: string;
    };
    registration: {
      ctaText: string;
      ctaPosition: string;
    };
    navbar: {
      style: string;
      showLogo: boolean;
    };
    footer: {
      showOrganizer: boolean;
      customText: string;
    };
  };
}
