"use server";

import { z } from "zod";
import { createPublicAction } from "@eventkit/lib/safe-action";
import {
  attendeeLoginSchema,
  changePasswordSchema,
} from "@eventkit/lib/validators";
import { createServerSupabaseClient } from "@eventkit/lib/supabase/server";
import { checkRateLimit } from "@eventkit/lib/rate-limit";

export const loginAction = createPublicAction(
  attendeeLoginSchema,
  async (input) => {
    const rateCheck = checkRateLimit(`login:${input.email}`, 5, 15 * 60_000);
    if (!rateCheck.allowed) {
      throw new Error("Too many attempts. Try again later.");
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      throw new Error("Invalid email or password");
    }

    return {
      userId: data.user.id,
      mustChangePassword:
        data.user.user_metadata?.must_change_password === true,
    };
  }
);

export const changePasswordAction = createPublicAction(
  changePasswordSchema,
  async (input) => {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("You must be logged in to change your password");
    }

    const { error } = await supabase.auth.updateUser({
      password: input.newPassword,
      data: {
        must_change_password: false,
        temporary_password: null,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  }
);

export const logoutAction = createPublicAction(z.object({}), async () => {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  return {};
});
