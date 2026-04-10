import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrganizationByClerkUserId } from "@eventkit/db/queries";
import { CreateEventForm } from "./create-event-form";

export default async function CreateEventPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const org = await getOrganizationByClerkUserId(userId);
  if (!org) redirect("/onboarding");

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create Event</h1>
        <p className="text-sm text-muted-foreground">
          Fill in the details to create a new event.
        </p>
      </div>
      <CreateEventForm />
    </div>
  );
}
