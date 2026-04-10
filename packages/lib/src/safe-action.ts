import type { z } from "zod";
import type { ActionResult } from "@eventkit/types";

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
