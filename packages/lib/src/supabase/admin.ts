import { createClient } from "@supabase/supabase-js";
import { db } from "@eventkit/db/client";
import { sql } from "drizzle-orm";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function getAuthUserIdByEmail(
  email: string
): Promise<string | null> {
  const result = await db.execute(
    sql`SELECT id FROM auth.users WHERE email = ${email} LIMIT 1`
  );
  return (result[0]?.id as string) ?? null;
}
