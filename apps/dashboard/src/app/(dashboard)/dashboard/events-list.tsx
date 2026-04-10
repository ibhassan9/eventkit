"use client";

import Link from "next/link";
import { Button } from "@eventkit/ui/button";
import { Badge } from "@eventkit/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@eventkit/ui/card";
import { Plus, CalendarDays, Users, Loader2 } from "lucide-react";
import { formatDateRange } from "@eventkit/lib/utils";
import { EventsEmptyState } from "./events-empty-state";
import { useEvents } from "@/hooks/use-events";

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  draft: { label: "Draft", className: "bg-zinc-100 text-zinc-700" },
  published: { label: "Published", className: "bg-green-100 text-green-700" },
  completed: { label: "Completed", className: "bg-blue-100 text-blue-700" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

export function EventsList() {
  const { data: events, isLoading, error } = useEvents();

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events</h1>
          <p className="text-sm text-muted-foreground">
            {events.length} event{events.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/events/new">
          <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
            <Plus className="mr-1.5 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const status = statusConfig[event.status];
          return (
            <Link key={event.id} href={`/events/${event.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-1 text-base">
                      {event.name}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className={status.className}
                    >
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>
                      {formatDateRange(
                        event.startDate,
                        event.endDate,
                        event.timezone
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>
                      {event.attendees?.length ?? 0} attendee
                      {(event.attendees?.length ?? 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
