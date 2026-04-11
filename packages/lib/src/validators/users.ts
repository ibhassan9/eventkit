import { z } from "zod";

export const attendeeLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  slug: z.string().min(1),
});

export const changePasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const adminAddAttendeeSchema = z.object({
  eventId: z.string().uuid(),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
  company: z.string().max(200).optional(),
  jobTitle: z.string().max(200).optional(),
  ticketTypeId: z.string().uuid().optional(),
  paymentStatus: z.enum(["free", "paid"]).optional(),
  customFieldValues: z.record(z.string(), z.string()).optional(),
  sendWelcomeEmail: z.boolean().optional(),
});

export type AttendeeLoginInput = z.infer<typeof attendeeLoginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type AdminAddAttendeeInput = z.infer<typeof adminAddAttendeeSchema>;
