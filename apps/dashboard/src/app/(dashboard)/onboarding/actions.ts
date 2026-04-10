"use server";

import { revalidatePath } from "next/cache";
import { createAuthAction } from "@/lib/safe-action";
import { createOrganizationSchema } from "@eventkit/lib/validators";
import {
  createOrganization,
  getOrganizationBySlug,
} from "@eventkit/db/queries";

export const createOrg = createAuthAction(
  createOrganizationSchema,
  async (input, ctx) => {
    const existing = await getOrganizationBySlug(input.slug);
    if (existing) {
      throw new Error("An organization with this slug already exists");
    }

    const org = await createOrganization({
      name: input.name,
      slug: input.slug,
      clerkUserId: ctx.userId,
      logoUrl: input.logoUrl,
    });

    revalidatePath("/dashboard");
    return org;
  }
);
