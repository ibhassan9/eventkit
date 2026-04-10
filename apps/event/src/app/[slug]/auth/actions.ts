"use server";

import { z } from "zod";
import { createPublicAction } from "@eventkit/lib/safe-action";
import { attendeeLoginSchema, changePasswordSchema } from "@eventkit/lib/validators";
import { findUserByEmail, updateUserPassword, updateUserLastLogin } from "@eventkit/db/queries";
import { verifyPassword, hashPassword } from "@eventkit/lib/passwords";
import { checkRateLimit } from "@eventkit/lib/rate-limit";
import {
  createAttendeeSession,
  getAttendeeUser,
  destroyAttendeeSession,
} from "@/lib/attendee-auth";

export const loginAction = createPublicAction(
  attendeeLoginSchema,
  async (input) => {
    const rateCheck = checkRateLimit(`login:${input.email}`, 5, 15 * 60_000);
    if (!rateCheck.allowed) {
      throw new Error("Too many attempts. Try again later.");
    }

    const user = await findUserByEmail(input.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      throw new Error("Invalid email or password");
    }

    await createAttendeeSession(user.id);
    await updateUserLastLogin(user.id);

    return { userId: user.id, mustChangePassword: user.mustChangePassword };
  }
);

export const changePasswordAction = createPublicAction(
  changePasswordSchema,
  async (input) => {
    const user = await getAttendeeUser();
    if (!user) {
      throw new Error("You must be logged in to change your password");
    }

    const passwordHash = await hashPassword(input.newPassword);
    await updateUserPassword(user.id, {
      passwordHash,
      mustChangePassword: false,
      temporaryPassword: null,
    });

    return { success: true };
  }
);

export const logoutAction = createPublicAction(
  z.object({}),
  async () => {
    await destroyAttendeeSession();
    return {};
  }
);
