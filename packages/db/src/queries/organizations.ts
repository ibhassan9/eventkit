import { eq } from "drizzle-orm";
import { db } from "../client";
import { organizations } from "../schema";

export async function getOrganizationByClerkUserId(clerkUserId: string) {
  return db.query.organizations.findFirst({
    where: eq(organizations.clerkUserId, clerkUserId),
  });
}

export async function getOrganizationBySlug(slug: string) {
  return db.query.organizations.findFirst({
    where: eq(organizations.slug, slug),
  });
}

export async function getOrganizationById(id: string) {
  return db.query.organizations.findFirst({
    where: eq(organizations.id, id),
  });
}

export async function createOrganization(data: {
  name: string;
  slug: string;
  clerkUserId: string;
  logoUrl?: string;
}) {
  const [org] = await db.insert(organizations).values(data).returning();
  return org;
}

export async function updateOrganization(
  id: string,
  data: Partial<{
    name: string;
    slug: string;
    logoUrl: string | null;
    stripeAccountId: string | null;
    stripeOnboardingComplete: boolean;
  }>
) {
  const [org] = await db
    .update(organizations)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(organizations.id, id))
    .returning();
  return org;
}

export async function deleteOrganization(id: string) {
  await db.delete(organizations).where(eq(organizations.id, id));
}
