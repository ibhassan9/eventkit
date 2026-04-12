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
  smallText,
  ctaSection,
  button,
  hr,
  footer,
} from "./styles";

interface WaitlistConfirmationEmailProps {
  attendeeName: string;
  eventName: string;
  eventDate: string;
  venue?: string;
  ticketType: string;
  position: number;
  eventSlug?: string;
}

export function WaitlistConfirmationEmail({
  attendeeName = "Jane Doe",
  eventName = "TechConf 2026",
  eventDate = "May 15, 2026 at 9:00 AM",
  venue,
  ticketType = "General Admission",
  position = 1,
  eventSlug,
}: WaitlistConfirmationEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://eventkit.dev";
  const eventUrl = eventSlug ? `${baseUrl}/${eventSlug}` : "#";

  return (
    <Html>
      <Head />
      <Preview>
        {`You're #${position} on the waitlist for ${ticketType} at ${eventName}`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You&apos;re on the waitlist!</Heading>
          <Text style={text}>Hi {attendeeName},</Text>
          <Text style={text}>
            You&apos;ve been added to the waitlist for{" "}
            <strong>{ticketType}</strong> at <strong>{eventName}</strong>.
            We&apos;ll notify you as soon as a spot becomes available.
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
            <Text style={detailLabel}>Waitlist Position</Text>
            <Text style={detailValue}>#{position}</Text>
          </Section>

          <Text style={smallText}>
            Your position may change as others ahead of you complete or cancel
            their registrations. We&apos;ll email you when it&apos;s your turn.
          </Text>

          {eventUrl !== "#" && (
            <Section style={ctaSection}>
              <Link href={eventUrl} style={button}>
                View Event
              </Link>
            </Section>
          )}

          <Hr style={hr} />
          <Text style={footer}>
            Powered by EventKit - AI-native event management
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default WaitlistConfirmationEmail;
