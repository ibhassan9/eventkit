"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/safe-action";
import { updateOrganizationSchema } from "@/lib/validators";
import {
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  getOrganizationBySlug,
} from "@/db/queries";
import {
  createConnectAccount,
  createAccountLink,
  getAccountStatus,
} from "@/lib/stripe";

export const updateOrg = createSafeAction(
  updateOrganizationSchema,
  async (input, ctx) => {
    if (input.slug) {
      const existing = await getOrganizationBySlug(input.slug);
      if (existing && existing.id !== ctx.organizationId) {
        throw new Error("An organization with this slug already exists");
      }
    }

    const org = await updateOrganization(ctx.organizationId, input);
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return org;
  }
);

export const deleteOrg = createSafeAction(
  z.object({ id: z.string().uuid() }),
  async (input, ctx) => {
    if (input.id !== ctx.organizationId) {
      throw new Error("Unauthorized");
    }

    await deleteOrganization(ctx.organizationId);
    revalidatePath("/dashboard");
  }
);

export const connectStripe = createSafeAction(
  z.object({}),
  async (_input, ctx) => {
    const org = await getOrganizationById(ctx.organizationId);
    if (!org) throw new Error("Organization not found");

    let accountId = org.stripeAccountId;

    if (!accountId) {
      const account = await createConnectAccount();
      accountId = account.id;
      await updateOrganization(ctx.organizationId, {
        stripeAccountId: accountId,
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const link = await createAccountLink(
      accountId,
      `${baseUrl}/settings`,
      `${baseUrl}/settings`
    );

    return link.url;
  }
);

export const checkStripeStatus = createSafeAction(
  z.object({}),
  async (_input, ctx) => {
    const org = await getOrganizationById(ctx.organizationId);
    if (!org?.stripeAccountId) {
      throw new Error("No Stripe account connected");
    }

    const status = await getAccountStatus(org.stripeAccountId);

    if (status.chargesEnabled && !org.stripeOnboardingComplete) {
      await updateOrganization(ctx.organizationId, {
        stripeOnboardingComplete: true,
      });
    }

    revalidatePath("/settings");
    return status;
  }
);
