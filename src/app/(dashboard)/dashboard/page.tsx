import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrganizationByClerkUserId, getEventsWithCountsByOrgId } from "@/db/queries";
import { EventsList } from "./events-list";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const org = await getOrganizationByClerkUserId(userId);
  if (!org) redirect("/onboarding");

  const events = await getEventsWithCountsByOrgId(org.id);

  return (
    <div className="p-6">
      <EventsList events={events} currency={events[0]?.currency ?? "CAD"} />
    </div>
  );
}
