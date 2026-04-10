import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrganizationByClerkUserId } from "@eventkit/db/queries";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const org = await getOrganizationByClerkUserId(userId);

  if (!org) {
    return (
      <div className="min-h-screen bg-zinc-50">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar orgName={org.name} orgLogoUrl={org.logoUrl} />
      <div className="flex flex-1 flex-col">
        <MobileSidebar orgName={org.name} orgLogoUrl={org.logoUrl} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
