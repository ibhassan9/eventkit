import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrganizationByClerkUserId } from "@/db/queries";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const org = await getOrganizationByClerkUserId(userId);
  if (org) redirect("/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Create your organization
          </h1>
          <p className="text-sm text-muted-foreground">
            Set up your organization to start managing events.
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
}
