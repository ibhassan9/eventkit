import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
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
  hr,
  footer,
} from "./styles";

interface EventCancelledEmailProps {
  attendeeName: string;
  eventName: string;
  eventDate: string;
  venue?: string;
  refundInfo?: string;
  reason?: string;
}

export function EventCancelledEmail({
  attendeeName = "Jane Doe",
  eventName = "TechConf 2026",
  eventDate = "May 15, 2026 at 9:00 AM",
  venue,
  refundInfo,
  reason,
}: EventCancelledEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{eventName} has been cancelled</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Event Cancelled</Heading>
          <Text style={text}>Hi {attendeeName},</Text>
          <Text style={text}>
            We&apos;re sorry to inform you that <strong>{eventName}</strong> has
            been cancelled.
          </Text>

          {reason && (
            <Text style={text}>{reason}</Text>
          )}

          <Section style={detailsSection}>
            <Text style={detailLabel}>Event</Text>
            <Text style={detailValue}>{eventName}</Text>
            <Text style={detailLabel}>Original Date</Text>
            <Text style={detailValue}>{eventDate}</Text>
            {venue && (
              <>
                <Text style={detailLabel}>Venue</Text>
                <Text style={detailValue}>{venue}</Text>
              </>
            )}
          </Section>

          {refundInfo && (
            <Text style={text}>{refundInfo}</Text>
          )}

          <Text style={smallText}>
            We apologize for any inconvenience. If you have any questions, please
            contact the event organizer directly.
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

export default EventCancelledEmail;
