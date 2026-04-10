"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/safe-action";
import {
  getEmailTemplateById,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  createEmailSend,
  updateEmailSend,
  getAttendeesByEventId,
  getEventById,
} from "@eventkit/db/queries";
import { renderEmailHtml, renderSubject } from "@eventkit/lib/email/render";
import { sendBatchEmails } from "@eventkit/lib/resend";

const saveSchema = z.object({
  eventId: z.string().uuid(),
  templateId: z.string().uuid().optional(),
  name: z.string().min(1).max(100),
  subject: z.string().min(1).max(200),
  body: z.string().min(1),
  type: z.enum(["confirmation", "reminder", "update", "custom"]),
});

export const saveEmailTemplate = createSafeAction(
  saveSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }

    if (input.templateId) {
      const updated = await updateEmailTemplate(input.templateId, {
        name: input.name,
        subject: input.subject,
        body: input.body,
        type: input.type,
      });
      revalidatePath(`/events/${input.eventId}/emails`);
      return updated;
    }

    const created = await createEmailTemplate({
      eventId: input.eventId,
      name: input.name,
      subject: input.subject,
      body: input.body,
      type: input.type,
    });
    revalidatePath(`/events/${input.eventId}/emails`);
    return created;
  }
);

const deleteSchema = z.object({
  eventId: z.string().uuid(),
  templateId: z.string().uuid(),
});

export const deleteEmailTemplateAction = createSafeAction(
  deleteSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }
    await deleteEmailTemplate(input.templateId);
    revalidatePath(`/events/${input.eventId}/emails`);
  }
);

const sendSchema = z.object({
  eventId: z.string().uuid(),
  templateId: z.string().uuid(),
  recipientFilter: z.enum(["all", "checked-in", "not-checked-in"]),
});

export const sendEmailToAttendees = createSafeAction(
  sendSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }

    const template = await getEmailTemplateById(input.templateId);
    if (!template) throw new Error("Template not found");

    const checkedIn =
      input.recipientFilter === "checked-in"
        ? true
        : input.recipientFilter === "not-checked-in"
          ? false
          : undefined;

    const attendees = await getAttendeesByEventId(input.eventId, { checkedIn });
    if (attendees.length === 0) throw new Error("No recipients found");

    const send = await createEmailSend({
      emailTemplateId: template.id,
      eventId: input.eventId,
      recipientCount: attendees.length,
      status: "sending",
    });

    const BATCH_SIZE = 100;
    const DELAY_MS = 600;
    let sentCount = 0;

    for (let i = 0; i < attendees.length; i += BATCH_SIZE) {
      const batch = attendees.slice(i, i + BATCH_SIZE);
      const emails = batch.map((attendee) => ({
        to: attendee.email,
        subject: renderSubject(template.subject, attendee, event),
        html: renderEmailHtml(template.body, attendee, event),
      }));

      await sendBatchEmails(emails);
      sentCount += batch.length;

      if (i + BATCH_SIZE < attendees.length) {
        await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
      }
    }

    await updateEmailSend(send.id, { status: "sent", sentAt: new Date() });
    return { sentCount };
  }
);
