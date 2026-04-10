import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
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
  qrSection,
  qrImage,
  smallText,
  ctaSection,
  button,
  hr,
  footer,
} from "./styles";

interface ConfirmationEmailProps {
  attendeeName: string;
  eventName: string;
  eventDate: string;
  venue?: string;
  ticketType: string;
  qrCodeDataUrl: string;
  eventSlug?: string;
  /** @deprecated Use `venue` instead */
  eventVenue?: string;
  /** @deprecated Use generated calendar URL from eventSlug */
  calendarUrl?: string;
}

export function ConfirmationEmail({
  attendeeName = "Jane Doe",
  eventName = "TechConf 2026",
  eventDate = "May 15, 2026 at 9:00 AM",
  venue,
  eventVenue = "Metro Toronto Convention Centre",
  ticketType = "General Admission",
  qrCodeDataUrl = "",
  eventSlug,
  calendarUrl,
}: ConfirmationEmailProps) {
  const displayVenue = venue ?? eventVenue;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://eventkit.dev";
  const eventUrl = eventSlug ? `${baseUrl}/${eventSlug}` : "#";
  return (
    <Html>
      <Head />
      <Preview>You&apos;re registered for {eventName}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You&apos;re registered!</Heading>
          <Text style={text}>Hi {attendeeName},</Text>
          <Text style={text}>
            Your registration for <strong>{eventName}</strong> is confirmed.
            We can&apos;t wait to see you there!
          </Text>

          <Section style={detailsSection}>
            <Text style={detailLabel}>Event</Text>
            <Text style={detailValue}>{eventName}</Text>
            <Text style={detailLabel}>Date</Text>
            <Text style={detailValue}>{eventDate}</Text>
            {displayVenue && (
              <>
                <Text style={detailLabel}>Venue</Text>
                <Text style={detailValue}>{displayVenue}</Text>
              </>
            )}
            <Text style={detailLabel}>Ticket</Text>
            <Text style={detailValue}>{ticketType}</Text>
          </Section>

          {qrCodeDataUrl && (
            <Section style={qrSection}>
              <Text style={detailLabel}>Your Check-in QR Code</Text>
              <Img
                src={qrCodeDataUrl}
                alt="Check-in QR Code"
                width={200}
                height={200}
                style={qrImage}
              />
              <Text style={smallText}>
                Show this code at the event entrance for quick check-in.
              </Text>
            </Section>
          )}

          <Section style={ctaSection}>
            {calendarUrl && (
              <Link href={calendarUrl} style={button}>
                Add to Calendar
              </Link>
            )}
            {eventUrl !== "#" && (
              <Link href={eventUrl} style={{ ...button, marginLeft: calendarUrl ? "8px" : "0" }}>
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

export default ConfirmationEmail;
