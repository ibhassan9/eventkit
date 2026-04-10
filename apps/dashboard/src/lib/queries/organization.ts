"use server";

import { createSafeQuery } from "@/lib/safe-action";
import { getOrganizationByClerkUserId } from "@eventkit/db/queries";

export const fetchOrganization = createSafeQuery(async (ctx) => {
  const org = await getOrganizationByClerkUserId(ctx.userId);
  if (!org) throw new Error("Organization not found");
  return org;
});
