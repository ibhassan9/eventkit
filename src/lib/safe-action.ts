import { auth } from "@clerk/nextjs/server";
import type { z } from "zod";
import type { ActionResult } from "@/types";
import { getOrganizationByClerkUserId } from "@/db/queries";

type SafeActionHandler<TInput, TOutput> = (
  input: TInput,
  ctx: { userId: string; organizationId: string }
) => Promise<TOutput>;

export function createSafeAction<TInput, TOutput>(
  schema: z.ZodSchema<TInput>,
  handler: SafeActionHandler<TInput, TOutput>
): (input: TInput) => Promise<ActionResult<TOutput>> {
  return async (rawInput: TInput) => {
    try {
      const { userId } = await auth();
      if (!userId) {
        return { success: false, error: "Unauthorized" };
      }

      const parsed = schema.safeParse(rawInput);
      if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        return { success: false, error: firstError?.message ?? "Invalid input" };
      }

      const org = await getOrganizationByClerkUserId(userId);
      if (!org) {
        return { success: false, error: "Organization not found" };
      }

      const result = await handler(parsed.data, {
        userId,
        organizationId: org.id,
      });

      return { success: true, data: result };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      return { success: false, error: message };
    }
  };
}

type AuthOnlyHandler<TInput, TOutput> = (
  input: TInput,
  ctx: { userId: string }
) => Promise<TOutput>;

export function createAuthAction<TInput, TOutput>(
  schema: z.ZodSchema<TInput>,
  handler: AuthOnlyHandler<TInput, TOutput>
): (input: TInput) => Promise<ActionResult<TOutput>> {
  return async (rawInput: TInput) => {
    try {
      const { userId } = await auth();
      if (!userId) {
        return { success: false, error: "Unauthorized" };
      }

      const parsed = schema.safeParse(rawInput);
      if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        return { success: false, error: firstError?.message ?? "Invalid input" };
      }

      const result = await handler(parsed.data, { userId });
      return { success: true, data: result };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      return { success: false, error: message };
    }
  };
}

export function createPublicAction<TInput, TOutput>(
  schema: z.ZodSchema<TInput>,
  handler: (input: TInput) => Promise<TOutput>
): (input: TInput) => Promise<ActionResult<TOutput>> {
  return async (rawInput: TInput) => {
    try {
      const parsed = schema.safeParse(rawInput);
      if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        return { success: false, error: firstError?.message ?? "Invalid input" };
      }

      const result = await handler(parsed.data);
      return { success: true, data: result };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      return { success: false, error: message };
    }
  };
}
