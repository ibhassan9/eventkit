import { Resend } from "resend";
import type { ReactElement } from "react";

let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY!);
  }
  return resendInstance;
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  react: ReactElement;
  from?: string;
}) {
  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: params.from ?? "EventKit <noreply@eventkit.dev>",
    to: [params.to],
    subject: params.subject,
    react: params.react,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}

export async function sendBatchEmails(
  emails: Array<{
    to: string;
    subject: string;
    html: string;
    from?: string;
  }>
) {
  const resend = getResend();
  const batch = emails.map((email) => ({
    from: email.from ?? "EventKit <noreply@eventkit.dev>",
    to: [email.to],
    subject: email.subject,
    html: email.html,
  }));

  const { data, error } = await resend.batch.send(batch);

  if (error) {
    throw new Error(`Failed to send batch emails: ${error.message}`);
  }

  return data;
}
