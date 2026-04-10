import { UserButton } from "@clerk/nextjs";
import { SidebarNav } from "./sidebar-nav";

interface SidebarProps {
  orgName: string;
  orgLogoUrl: string | null;
}

export function Sidebar({ orgName, orgLogoUrl }: SidebarProps) {
  return (
    <aside className="hidden lg:flex w-[60px] xl:w-60 flex-col bg-white border-r border-stone-200 transition-[width] duration-150 ease-out overflow-hidden">
      <div className="flex h-14 items-center gap-3 px-4 pt-5 pb-3">
        {orgLogoUrl ? (
          <img
            src={orgLogoUrl}
            alt={orgName}
            className="h-8 w-8 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-sm font-semibold text-stone-600">
            {orgName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden xl:block truncate text-sm font-semibold text-stone-900">
          {orgName}
        </span>
      </div>

      <SidebarNav />

      <div className="mt-auto border-t border-stone-200 px-3 py-4 flex items-center gap-3">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
            },
          }}
        />
        <span className="hidden xl:block truncate text-[13px] text-stone-500">Account</span>
      </div>
    </aside>
  );
}
