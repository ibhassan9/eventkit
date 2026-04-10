import Link from "next/link";
import { Button } from "@eventkit/ui/button";
import { Card, CardContent } from "@eventkit/ui/card";
import { CalendarDays, Plus } from "lucide-react";

export function EventsEmptyState() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Events</h1>
        <p className="text-sm text-muted-foreground">
          Manage your events and track registrations.
        </p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <CalendarDays className="mb-4 h-12 w-12 text-stone-300" />
          <h3 className="mb-1 text-base font-semibold text-stone-900">No events yet</h3>
          <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
            Create your first event to start managing registrations, tickets,
            and attendees.
          </p>
          <Link href="/events/new">
            <Button>
              <Plus className="mr-1.5 h-4 w-4" />
              Create Your First Event
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
