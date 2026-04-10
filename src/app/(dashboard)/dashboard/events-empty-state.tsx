import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
            <CalendarDays className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="mb-1 text-lg font-semibold">No events yet</h3>
          <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
            Create your first event to start managing registrations, tickets,
            and attendees.
          </p>
          <Link href="/events/new">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
              <Plus className="mr-1.5 h-4 w-4" />
              Create Your First Event
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
