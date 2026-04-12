"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@eventkit/lib/utils";
import {
  LayoutDashboard,
  Settings,
  CalendarDays,
  Calendar,
  Users,
  Users2,
  Globe,
  Mail,
  BadgeCheck,
  ClipboardCheck,
  TicketIcon,
  Tag,
  ListOrdered,
  ArrowLeft,
} from "lucide-react";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/settings", label: "Settings", icon: Settings },
];

const eventNavItems = [
  { href: "", label: "Overview", icon: CalendarDays },
  { href: "/registration", label: "Registration", icon: TicketIcon },
  { href: "/tickets", label: "Tickets", icon: Tag },
  { href: "/website", label: "Website", icon: Globe },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/speakers", label: "Speakers", icon: Users2 },
  { href: "/emails", label: "Emails", icon: Mail },
  { href: "/badges", label: "Badges", icon: BadgeCheck },
  { href: "/attendees", label: "Attendees", icon: Users },
  { href: "/waitlist", label: "Waitlist", icon: ListOrdered },
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
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "border-l-2 border-violet-500 bg-stone-100 text-stone-900 font-medium"
                : "text-stone-500 hover:bg-stone-50 hover:text-stone-700"
            )}
          >
            <item.icon className="size-[18px] shrink-0" />
            <span className="hidden xl:inline">{item.label}</span>
          </Link>
        );
      })}

      {eventId && (
        <>
          <div className="my-2 border-t border-stone-100" />
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors"
          >
            <ArrowLeft className="size-3.5 shrink-0" />
            <span className="hidden xl:inline">All Events</span>
          </Link>
          <div className="px-3 pt-2 pb-1 hidden xl:block">
            <p className="text-[13px] font-medium text-stone-400 truncate">
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
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors xl:pl-5",
                  isActive
                    ? "border-l-2 border-violet-500 bg-stone-100 text-stone-900 font-medium"
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-700"
                )}
              >
                <item.icon className="size-[18px] shrink-0" />
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            );
          })}
        </>
      )}
    </nav>
  );
}
