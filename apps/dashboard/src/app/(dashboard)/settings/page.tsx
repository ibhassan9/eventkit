import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrganizationByClerkUserId } from "@eventkit/db/queries";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const org = await getOrganizationByClerkUserId(userId);
  if (!org) redirect("/onboarding");

  return <SettingsClient org={org} />;
}
