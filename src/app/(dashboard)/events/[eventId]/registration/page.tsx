import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getEventById, getOrganizationByClerkUserId } from "@/db/queries";
import { RegistrationBuilder } from "./registration-builder";

export default async function RegistrationBuilderPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { eventId } = await params;
  const org = await getOrganizationByClerkUserId(userId);
  if (!org) redirect("/onboarding");

  const event = await getEventById(eventId);
  if (!event || event.organizationId !== org.id) notFound();

  const existingFields = event.registrationFields?.fields ?? [];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Registration Form
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure the registration form for {event.name}. Default fields
          (name and email) are always included.
        </p>
      </div>
      <RegistrationBuilder
        eventId={eventId}
        initialFields={existingFields}
      />
    </div>
  );
}
