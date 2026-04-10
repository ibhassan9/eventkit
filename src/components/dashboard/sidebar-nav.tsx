"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  CalendarDays,
  Users,
  Globe,
  Mail,
  BadgeCheck,
  ClipboardCheck,
  TicketIcon,
} from "lucide-react";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/settings", label: "Settings", icon: Settings },
];

const eventNavItems = [
  { href: "", label: "Overview", icon: CalendarDays },
  { href: "/registration", label: "Registration", icon: TicketIcon },
  { href: "/website", label: "Website", icon: Globe },
  { href: "/emails", label: "Emails", icon: Mail },
  { href: "/badges", label: "Badges", icon: BadgeCheck },
  { href: "/attendees", label: "Attendees", icon: Users },
  { href: "/checkin", label: "Check-in", icon: ClipboardCheck },
];

function extractEventId(pathname: string): string | null {
  const match = pathname.match(/^\/events\/([^/]+)/);
  return match ? match[1] : null;
}

export function SidebarNav() {
  const pathname = usePathname();
  const eventId = extractEventId(pathname);

  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {mainNavItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-l-2 border-indigo-500 bg-white/10 text-white"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}

      {eventId && (
        <>
          <div className="px-3 pt-6 pb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Event
            </p>
          </div>
          {eventNavItems.map((item) => {
            const href = `/events/${eventId}${item.href}`;
            const isActive =
              item.href === ""
                ? pathname === `/events/${eventId}`
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-l-2 border-indigo-500 bg-white/10 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </>
      )}
    </nav>
  );
}
