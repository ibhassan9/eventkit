"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@eventkit/ui/button";
import { Badge } from "@eventkit/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@eventkit/ui/dropdown-menu";
import { Plus, Loader2, MoreHorizontal, Pencil } from "lucide-react";
import { formatDateRange, formatCurrency } from "@eventkit/lib/utils";
import { EventsEmptyState } from "./events-empty-state";
import { useEvents } from "@/hooks/use-events";
import { DataTableToolbar } from "@/components/dashboard/data-table-toolbar";
import { useDebouncedValue } from "@/hooks/use-debounce";

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  draft: { label: "Draft", className: "bg-stone-100 text-stone-600" },
  published: { label: "Published", className: "bg-green-50 text-green-700" },
  completed: { label: "Completed", className: "bg-stone-100 text-stone-600" },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-700" },
};

export function EventsList() {
  const router = useRouter();
  const { data: events, isLoading, error } = useEvents();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center text-sm text-destructive">
        Failed to load events. Please try again.
      </div>
    );
  }

  if (!events || events.length === 0) {
    return <EventsEmptyState />;
  }

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Events</h1>
        <p className="text-sm text-muted-foreground">
          {events.length} event{events.length !== 1 ? "s" : ""}
        </p>
      </div>

      <DataTableToolbar
        searchPlaceholder="Search events..."
        searchValue={search}
        onSearchChange={setSearch}
        actions={
          <Link href="/events/new">
            <Button>
              <Plus className="mr-1.5 h-4 w-4" />
              Create Event
            </Button>
          </Link>
        }
      />

      <div className="rounded-xl border bg-card">
        <div className="relative w-full overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b bg-stone-50">
                <th className="h-10 px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">
                  Event
                </th>
                <th className="h-10 w-[150px] px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">
                  Date
                </th>
                <th className="h-10 w-[100px] px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">
                  Attendees
                </th>
                <th className="h-10 w-[100px] px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">
                  Revenue
                </th>
                <th className="h-10 w-[100px] px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">
                  Status
                </th>
                <th className="h-10 w-[50px] px-3" />
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => {
                const status = statusConfig[event.status];
                const revenue = (event.ticketTypes ?? []).reduce(
                  (sum, tt) => sum + (tt.soldCount ?? 0) * (tt.price ?? 0),
                  0
                );

                return (
                  <tr
                    key={event.id}
                    onClick={() => router.push(`/events/${event.id}`)}
                    className="border-b border-stone-100 hover:bg-stone-50/50 cursor-pointer transition-colors text-[13px] text-stone-700"
                  >
                    <td className="px-3 py-3">
                      <div className="font-medium text-stone-900">
                        {event.name}
                      </div>
                      {event.venue && (
                        <div className="text-xs text-stone-400">
                          {event.venue}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {formatDateRange(
                        event.startDate,
                        event.endDate,
                        event.timezone
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {event.attendees?.length ?? 0}
                    </td>
                    <td className="px-3 py-3">
                      {revenue > 0 ? formatCurrency(revenue, "CAD") : "$0"}
                    </td>
                    <td className="px-3 py-3">
                      <Badge variant="secondary" className={status.className}>
                        {status.label}
                      </Badge>
                    </td>
                    <td
                      className="px-3 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md p-1 hover:bg-stone-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/events/${event.id}`)
                            }
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
