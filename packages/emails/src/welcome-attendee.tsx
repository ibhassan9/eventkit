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
import {
  main,
  container,
  h1,
  text,
  detailsSection,
  detailLabel,
  detailValue,
  ctaSection,
  button,
  hr,
  footer,
} from "./styles";

interface WelcomeAttendeeEmailProps {
  attendeeName: string;
  eventName: string;
  eventDate: string;
  venue?: string;
  ticketType: string;
  email: string;
  tempPassword: string;
  eventSlug?: string;
}

const credentialsSection = {
  backgroundColor: "#fef3c7",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
  border: "1px solid #fde68a",
};

const credentialsLabel = {
  color: "#92400e",
  fontSize: "12px",
  fontWeight: "600" as const,
  textTransform: "uppercase" as const,
  margin: "0 0 12px",
};

const credentialsValue = {
  color: "#1a1a1a",
  fontSize: "15px",
  fontFamily: "monospace",
  margin: "4px 0 8px",
};

export function WelcomeAttendeeEmail({
  attendeeName = "Jane Doe",
  eventName = "TechConf 2026",
  eventDate = "May 15, 2026",
  venue,
  ticketType = "General Admission",
  email = "jane@example.com",
  tempPassword = "maple-river-42",
  eventSlug,
}: WelcomeAttendeeEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://eventkit.dev";
  const eventUrl = eventSlug ? `${baseUrl}/${eventSlug}` : "#";

  return (
    <Html>
      <Head />
      <Preview>You&apos;ve been registered for {eventName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome!</Heading>
          <Text style={text}>Hi {attendeeName},</Text>
          <Text style={text}>
            You&apos;ve been registered for <strong>{eventName}</strong>.
          </Text>

          <Section style={detailsSection}>
            <Text style={detailLabel}>Event</Text>
            <Text style={detailValue}>{eventName}</Text>
            <Text style={detailLabel}>Date</Text>
            <Text style={detailValue}>{eventDate}</Text>
            {venue && (
              <>
                <Text style={detailLabel}>Venue</Text>
                <Text style={detailValue}>{venue}</Text>
              </>
            )}
            <Text style={detailLabel}>Ticket</Text>
            <Text style={detailValue}>{ticketType}</Text>
          </Section>

          <Section style={credentialsSection}>
            <Text style={credentialsLabel}>Your Login Credentials</Text>
            <Text style={{ ...text, margin: "0 0 4px", fontSize: "14px" }}>
              Email
            </Text>
            <Text style={credentialsValue}>{email}</Text>
            <Text style={{ ...text, margin: "0 0 4px", fontSize: "14px" }}>
              Temporary Password
            </Text>
            <Text style={credentialsValue}>{tempPassword}</Text>
            <Text
              style={{
                color: "#92400e",
                fontSize: "13px",
                margin: "12px 0 0",
              }}
            >
              You&apos;ll be asked to change your password on first login.
            </Text>
          </Section>

          <Section style={ctaSection}>
            {eventUrl !== "#" && (
              <Link href={eventUrl} style={button}>
                View Event
              </Link>
            )}
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

export default WelcomeAttendeeEmail;
