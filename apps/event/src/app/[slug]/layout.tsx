import { notFound } from "next/navigation";
import { Figtree, Inter, Plus_Jakarta_Sans, DM_Sans, Source_Sans_3 } from "next/font/google";
import { defaultWebsitePages } from "@eventkit/lib/default-website-pages";
import { getEvent } from "./lib/get-event";
import { resolveTheme } from "./lib/theme";
import { EventNav } from "./components/event-nav";
import { getAttendeeUser, getAttendeeForEvent } from "@/lib/attendee-auth";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-event" });
const inter = Inter({ subsets: ["latin"], variable: "--font-event" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-event" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-event" });
const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: "--font-event" });

const FONT_MAP: Record<string, typeof inter> = {
  figtree,
  inter,
  "plus-jakarta-sans": plusJakarta,
  "dm-sans": dmSans,
  "source-sans-3": sourceSans,
};

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function EventLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const attendeeUser = await getAttendeeUser();
  let isRegistered = false;
  if (attendeeUser) {
    const attendee = await getAttendeeForEvent(attendeeUser.id, event.id);
    isRegistered = !!attendee;
  }

  const websitePages = event.websitePages ?? defaultWebsitePages();
  const theme = resolveTheme(event);
  const font = FONT_MAP[theme.fontFamily] ?? figtree;

  return (
    <div
      className={`min-h-screen ${font.variable}`}
      style={{
        "--event-primary": theme.primaryColor,
        "--event-accent": theme.accentColor,
        backgroundColor: "#ffffff",
        fontFamily: "var(--font-event), system-ui, sans-serif",
      } as React.CSSProperties}
    >
      <EventNav
        eventName={event.name}
        slug={slug}
        pages={websitePages.pages}
        primaryColor={theme.primaryColor}
        accentColor={theme.accentColor}
        ctaText={websitePages.settings.registration.ctaText}
        user={
          attendeeUser
            ? {
                id: attendeeUser.id,
                email: attendeeUser.email,
                firstName: attendeeUser.firstName,
              }
            : null
        }
        isRegistered={isRegistered}
      />
      <main>{children}</main>
      <footer
        className="border-t py-8 text-center text-sm"
        style={{ color: `${theme.primaryColor}80` }}
      >
        {websitePages.settings.footer.customText ? (
          <p>{websitePages.settings.footer.customText}</p>
        ) : (
          <p>Powered by EventKit</p>
        )}
      </footer>
    </div>
  );
}
