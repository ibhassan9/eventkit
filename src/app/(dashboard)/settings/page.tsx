import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrganizationByClerkUserId } from "@/db/queries";
import { SettingsGeneral } from "./settings-general";
import { SettingsStripe } from "./settings-stripe";
import { SettingsDanger } from "./settings-danger";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const org = await getOrganizationByClerkUserId(userId);
  if (!org) redirect("/onboarding");

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your organization settings.
        </p>
      </div>
      <SettingsGeneral org={org} />
      <SettingsStripe org={org} />
      <SettingsDanger orgId={org.id} orgName={org.name} />
    </div>
  );
}
