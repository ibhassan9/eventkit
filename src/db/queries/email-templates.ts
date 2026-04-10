import { eq } from "drizzle-orm";
import { db } from "@/db";
import { emailTemplates, emailSends } from "@/db/schema";

export async function getEmailTemplatesByEventId(eventId: string) {
  return db.query.emailTemplates.findMany({
    where: eq(emailTemplates.eventId, eventId),
  });
}

export async function getEmailTemplateById(id: string) {
  return db.query.emailTemplates.findFirst({
    where: eq(emailTemplates.id, id),
  });
}

export async function createEmailTemplate(data: {
  eventId: string;
  name: string;
  subject: string;
  body: string;
  type?: "confirmation" | "reminder" | "update" | "custom";
  isActive?: boolean;
}) {
  const [template] = await db
    .insert(emailTemplates)
    .values(data)
    .returning();
  return template;
}

export async function updateEmailTemplate(
  id: string,
  data: Partial<{
    name: string;
    subject: string;
    body: string;
    type: "confirmation" | "reminder" | "update" | "custom";
    isActive: boolean;
  }>
) {
  const [template] = await db
    .update(emailTemplates)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(emailTemplates.id, id))
    .returning();
  return template;
}

export async function deleteEmailTemplate(id: string) {
  await db.delete(emailTemplates).where(eq(emailTemplates.id, id));
}

export async function createEmailSend(data: {
  emailTemplateId?: string;
  eventId: string;
  recipientCount: number;
  status?: "draft" | "sending" | "sent" | "failed";
}) {
  const [send] = await db.insert(emailSends).values(data).returning();
  return send;
}

export async function updateEmailSend(
  id: string,
  data: Partial<{
    status: "draft" | "sending" | "sent" | "failed";
    sentAt: Date;
    recipientCount: number;
  }>
) {
  const [send] = await db
    .update(emailSends)
    .set(data)
    .where(eq(emailSends.id, id))
    .returning();
  return send;
}
