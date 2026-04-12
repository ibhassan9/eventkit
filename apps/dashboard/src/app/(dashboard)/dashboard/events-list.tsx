"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@eventkit/ui/button";
import { Badge } from "@eventkit/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@eventkit/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@eventkit/ui/alert-dialog";
import { Plus, Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { formatDateRange, formatCurrency } from "@eventkit/lib/utils";
import { EventsEmptyState } from "./events-empty-state";
import { useEvents, useDeleteEvent } from "@/hooks/use-events";
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

const STATUS_FILTERS = ["all", "draft", "published", "completed", "cancelled"] as const;

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function EventsList() {
  const router = useRouter();
  const { data: events, isLoading, error } = useEvents();
  const deleteEvent = useDeleteEvent();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [filter, setFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

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

  const searchFiltered = events.filter((event) =>
    event.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const filteredEvents =
    filter === "all"
      ? searchFiltered
      : searchFiltered.filter((event) => event.status === filter);

  const activeEvents =
    filter === "all"
      ? filteredEvents.filter(
          (e) => e.status === "draft" || e.status === "published"
        )
      : [];

  const pastEvents =
    filter === "all"
      ? filteredEvents.filter(
          (e) => e.status === "completed" || e.status === "cancelled"
        )
      : [];

  async function handleDelete() {
    if (!deleteTarget) return;
    const result = await deleteEvent.mutateAsync({ eventId: deleteTarget.id });
    if (result.success) {
      toast.success("Event deleted");
      setDeleteTarget(null);
    } else {
      toast.error(result.error);
    }
  }

  type EventItem = NonNullable<typeof events>[number];

  function renderEventRow(event: EventItem) {
    const status = statusConfig[event.status];
    const revenue = (event.ticketTypes ?? []).reduce(
      (sum: number, tt: { soldCount: number; price: number }) =>
        sum + (tt.soldCount ?? 0) * (tt.price ?? 0),
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
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() =>
                  setDeleteTarget({ id: event.id, name: event.name })
                }
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
    );
  }

  function renderTable(eventsList: EventItem[]) {
    return (
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
              {eventsList.map(renderEventRow)}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <>
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

        <div className="flex gap-2">
          {STATUS_FILTERS.map((s) => (
            <Button
              key={s}
              variant={filter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(s)}
            >
              {capitalize(s)}
            </Button>
          ))}
        </div>

        {filter === "all" ? (
          <div className="space-y-8">
            {activeEvents.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-stone-500">
                  Active Events
                </h2>
                {renderTable(activeEvents)}
              </div>
            )}
            {pastEvents.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-stone-500">
                  Past Events
                </h2>
                {renderTable(pastEvents)}
              </div>
            )}
            {activeEvents.length === 0 && pastEvents.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No events match your search.
              </div>
            )}
          </div>
        ) : (
          <>
            {filteredEvents.length > 0 ? (
              renderTable(filteredEvents)
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No {filter} events found.
              </div>
            )}
          </>
        )}
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The event and all associated data
              will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteEvent.isPending}
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteEvent.isPending ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Forever"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
