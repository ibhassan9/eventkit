"use client";

import { ExternalLink, RefreshCw, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@eventkit/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@eventkit/ui/card";
import { formatDate } from "@eventkit/lib/utils";
import { useCheckinDashboard } from "@/hooks/use-checkin";
import { StatsCards } from "./stats-cards";

interface CheckinDashboardClientProps {
  eventId: string;
}

export function CheckinDashboardClient({
  eventId,
}: CheckinDashboardClientProps) {
  const { data, isLoading, error, refetch } = useCheckinDashboard(eventId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-24 text-center text-sm text-destructive">
        Failed to load check-in data. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StatsCards
        total={data.total}
        checkedIn={data.checkedIn}
        remaining={data.remaining}
      />

      <div className="flex items-center gap-3">
        <a
          href={`/${eventId}`}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ExternalLink className="mr-1.5 h-4 w-4" />
          Open Check-in App
        </a>
        <Button variant="ghost" size="sm" onClick={() => refetch()}>
          <RefreshCw className="mr-1.5 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentCheckins.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No check-ins yet. Open the check-in app to start scanning.
            </p>
          ) : (
            <div className="space-y-2">
              {data.recentCheckins.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <div>
                    <p className="font-medium">
                      {c.firstName} {c.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </div>
                  {c.checkedInAt && (
                    <span className="text-xs text-muted-foreground">
                      {formatDate(c.checkedInAt)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
