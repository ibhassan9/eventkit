import { createHmac } from "crypto";

function getSecret(): string {
  const secret = process.env.WAITLIST_SECRET ?? process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("WAITLIST_SECRET is not set");
  return secret;
}

export function generateWaitlistToken(
  entryId: string,
  email: string
): string {
  const hmac = createHmac("sha256", getSecret());
  hmac.update(`${entryId}:${email}`);
  return hmac.digest("hex");
}

export function verifyWaitlistToken(
  token: string,
  entryId: string,
  email: string
): boolean {
  const expected = generateWaitlistToken(entryId, email);
  return token === expected;
}
