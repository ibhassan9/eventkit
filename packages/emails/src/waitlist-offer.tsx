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

interface WaitlistOfferEmailProps {
  attendeeName: string;
  eventName: string;
  eventDate: string;
  venue?: string;
  ticketType: string;
  acceptUrl: string;
  expiresAt: string;
}

export function WaitlistOfferEmail({
  attendeeName = "Jane Doe",
  eventName = "TechConf 2026",
  eventDate = "May 15, 2026 at 9:00 AM",
  venue,
  ticketType = "General Admission",
  acceptUrl = "#",
  expiresAt = "48 hours",
}: WaitlistOfferEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        A spot opened up for {ticketType} at {eventName}!
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>A spot opened up!</Heading>
          <Text style={text}>Hi {attendeeName},</Text>
          <Text style={text}>
            Great news! A spot has become available for{" "}
            <strong>{ticketType}</strong> at <strong>{eventName}</strong>. You
            have until <strong>{expiresAt}</strong> to complete your
            registration.
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

          <Section style={ctaSection}>
            <Link href={acceptUrl} style={button}>
              Complete Registration
            </Link>
          </Section>

          <Text style={smallText}>
            This offer expires on {expiresAt}. If you don&apos;t complete your
            registration by then, the spot will be offered to the next person on
            the waitlist.
          </Text>

          <Hr style={hr} />
          <Text style={footer}>
            Powered by EventKit - AI-native event management
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default WaitlistOfferEmail;
