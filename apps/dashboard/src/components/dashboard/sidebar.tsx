import { UserButton } from "@clerk/nextjs";
import { CalendarDays } from "lucide-react";
import { SidebarNav } from "./sidebar-nav";

interface SidebarProps {
  orgName: string;
  orgLogoUrl: string | null;
}

export function Sidebar({ orgName, orgLogoUrl }: SidebarProps) {
  return (
    <aside className="hidden w-64 flex-col bg-zinc-950 md:flex">
      <div className="flex h-14 items-center gap-3 border-b border-white/10 px-6">
        {orgLogoUrl ? (
          <img
            src={orgLogoUrl}
            alt={orgName}
            className="h-7 w-7 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600">
            <CalendarDays className="h-4 w-4 text-white" />
          </div>
        )}
        <span className="truncate text-sm font-semibold text-white">
          {orgName}
        </span>
      </div>

      <SidebarNav />

      <div className="border-t border-white/10 p-4">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
            },
          }}
        />
      </div>
    </aside>
  );
}
