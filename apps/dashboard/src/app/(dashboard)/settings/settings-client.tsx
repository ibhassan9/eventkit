"use client";

import { useOrganization } from "@/hooks/use-organization";
import { SettingsGeneral } from "./settings-general";
import { SettingsStripe } from "./settings-stripe";
import { SettingsDanger } from "./settings-danger";


interface Org {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  stripeAccountId: string | null;
  stripeOnboardingComplete: boolean;
}

interface SettingsClientProps {
  org: Org;
}

export function SettingsClient({ org: initialOrg }: SettingsClientProps) {
  const { data: org } = useOrganization();

  const currentOrg = org ?? initialOrg;

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your organization settings.
        </p>
      </div>
      <SettingsGeneral org={currentOrg} />
      <SettingsStripe org={currentOrg} />
      <SettingsDanger orgId={currentOrg.id} orgName={currentOrg.name} />
    </div>
  );
}
