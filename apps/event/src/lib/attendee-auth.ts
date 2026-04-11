import { createServerSupabaseClient } from "@eventkit/lib/supabase/server";
import { getAttendeeByUserAndEvent } from "@eventkit/db/queries";

export async function getAttendeeUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return {
    id: user.id,
    email: user.email!,
    firstName: (user.user_metadata?.first_name as string) ?? "",
    lastName: (user.user_metadata?.last_name as string) ?? "",
    mustChangePassword: user.user_metadata?.must_change_password === true,
  };
}

export async function getAttendeeForEvent(userId: string, eventId: string) {
  return (await getAttendeeByUserAndEvent(userId, eventId)) ?? null;
}
