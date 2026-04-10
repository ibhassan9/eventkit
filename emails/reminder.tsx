import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ReminderEmailProps {
  attendeeName: string;
  eventName: string;
  eventDate: string;
  eventVenue?: string;
  calendarUrl: string;
}

export default function ReminderEmail({
  attendeeName = "Jane Doe",
  eventName = "TechConf 2026",
  eventDate = "May 15, 2026 at 9:00 AM",
  eventVenue = "Metro Toronto Convention Centre",
  calendarUrl = "#",
}: ReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{eventName} is coming up soon!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Event Reminder</Heading>
          <Text style={text}>Hi {attendeeName},</Text>
          <Text style={text}>
            Just a friendly reminder that <strong>{eventName}</strong> is coming
            up soon. We&apos;re looking forward to seeing you!
          </Text>

          <Section style={detailsSection}>
            <Text style={detailLabel}>Date</Text>
            <Text style={detailValue}>{eventDate}</Text>
            {eventVenue && (
              <>
                <Text style={detailLabel}>Venue</Text>
                <Text style={detailValue}>{eventVenue}</Text>
              </>
            )}
          </Section>

          <Section style={ctaSection}>
            <Link href={calendarUrl} style={button}>
              View in Calendar
            </Link>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            Powered by EventKit - AI-native event management
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
  borderRadius: "8px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "28px",
  fontWeight: "700" as const,
  margin: "0 0 20px",
  textAlign: "center" as const,
};

const text = {
  color: "#4a4a4a",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 12px",
};

const detailsSection = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const detailLabel = {
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: "600" as const,
  textTransform: "uppercase" as const,
  margin: "12px 0 2px",
};

const detailValue = {
  color: "#1a1a1a",
  fontSize: "16px",
  fontWeight: "500" as const,
  margin: "0 0 8px",
};

const ctaSection = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#4f46e5",
  borderRadius: "6px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "600" as const,
  padding: "12px 24px",
  textDecoration: "none",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0 16px",
};

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  textAlign: "center" as const,
};
