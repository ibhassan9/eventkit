"use server";

import {
  getEmailTemplatesByEventId,
  createEmailTemplate,
} from "@/db/queries";

export async function ensureDefaultTemplates(eventId: string) {
  const existing = await getEmailTemplatesByEventId(eventId);
  if (existing.length > 0) return existing;

  const confirmation = await createEmailTemplate({
    eventId,
    name: "Registration Confirmation",
    subject: "Your registration for {{eventName}} is confirmed!",
    body: `<h2>Welcome, {{firstName}}!</h2>
<p>Your registration for <strong>{{eventName}}</strong> has been confirmed.</p>
<p><strong>Date:</strong> {{eventDate}}</p>
<p><strong>Ticket:</strong> {{ticketType}}</p>
<p>Please save your QR code for check-in: {{qrCode}}</p>
<p>We look forward to seeing you there!</p>`,
    type: "confirmation",
  });

  const reminder = await createEmailTemplate({
    eventId,
    name: "Event Reminder",
    subject: "Reminder: {{eventName}} is coming up!",
    body: `<h2>Hi {{firstName}},</h2>
<p>Just a friendly reminder that <strong>{{eventName}}</strong> is coming up soon.</p>
<p><strong>Date:</strong> {{eventDate}}</p>
<p><strong>Your ticket:</strong> {{ticketType}}</p>
<p>Don&apos;t forget to bring your QR code for a smooth check-in experience.</p>
<p>See you there!</p>`,
    type: "reminder",
  });

  return [confirmation, reminder];
}
