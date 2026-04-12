import { eq } from "drizzle-orm";
import { db } from "../client";
import { badgeTemplates } from "../schema";
import type { AnyBadgeConfig } from "@eventkit/types";

export async function getBadgeTemplatesByEventId(eventId: string) {
  return db.query.badgeTemplates.findMany({
    where: eq(badgeTemplates.eventId, eventId),
  });
}

export async function getBadgeTemplateById(id: string) {
  return db.query.badgeTemplates.findFirst({
    where: eq(badgeTemplates.id, id),
  });
}

export async function createBadgeTemplate(data: {
  eventId: string;
  name: string;
  config: AnyBadgeConfig;
  isDefault?: boolean;
}) {
  const [template] = await db
    .insert(badgeTemplates)
    .values(data)
    .returning();
  return template;
}

export async function updateBadgeTemplate(
  id: string,
  data: Partial<{
    name: string;
    config: AnyBadgeConfig;
    isDefault: boolean;
  }>
) {
  const [template] = await db
    .update(badgeTemplates)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(badgeTemplates.id, id))
    .returning();
  return template;
}

export async function deleteBadgeTemplate(id: string) {
  await db.delete(badgeTemplates).where(eq(badgeTemplates.id, id));
}
