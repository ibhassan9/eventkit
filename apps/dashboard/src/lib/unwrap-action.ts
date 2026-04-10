import type { ActionResult } from "@eventkit/types";

export function unwrapAction<T>(result: ActionResult<T>): T {
  if (!result.success) throw new Error(result.error);
  return result.data;
}
