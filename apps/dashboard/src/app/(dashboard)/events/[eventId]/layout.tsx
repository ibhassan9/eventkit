import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import {
  getOrganizationByClerkUserId,
  getEventById,
} from "@eventkit/db/queries";

export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const org = await getOrganizationByClerkUserId(userId);
  if (!org) redirect("/onboarding");

  const { eventId } = await params;
  const event = await getEventById(eventId);

  if (!event) notFound();
  if (event.organizationId !== org.id) notFound();

  return <>{children}</>;
}
