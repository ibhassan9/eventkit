"use client";

import { useEffect, useState, useCallback } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";
import { Button, buttonVariants } from "@eventkit/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@eventkit/ui/card";
import { formatDate } from "@eventkit/lib/utils";
import { fetchDashboardCheckinStats } from "./actions";
import { StatsCards } from "./stats-cards";

interface RecentCheckin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  checkedInAt: string | null;
}

interface CheckinDashboardClientProps {
  eventId: string;
  eventSlug: string;
  initialStats: { total: number; checkedIn: number; remaining: number };
  initialRecentCheckins: RecentCheckin[];
}

export function CheckinDashboardClient({
  eventId,
  initialStats,
  initialRecentCheckins,
}: CheckinDashboardClientProps) {
  const [stats, setStats] = useState(initialStats);
  const [recentCheckins, setRecentCheckins] = useState(initialRecentCheckins);

  const refresh = useCallback(async () => {
    const result = await fetchDashboardCheckinStats({ eventId });
    if (result.success && result.data) {
      setStats({ total: result.data.total, checkedIn: result.data.checkedIn, remaining: result.data.remaining });
      setRecentCheckins(result.data.recentCheckins);
    }
  }, [eventId]);

  useEffect(() => {
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <div className="space-y-6">
      <StatsCards total={stats.total} checkedIn={stats.checkedIn} remaining={stats.remaining} />

      <div className="flex items-center gap-3">
        <a href={`/${eventId}`} target="_blank" rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "sm" })}>
          <ExternalLink className="mr-1.5 h-4 w-4" />
          Open Check-in App
        </a>
        <Button variant="ghost" size="sm" onClick={refresh}>
          <RefreshCw className="mr-1.5 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          {recentCheckins.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No check-ins yet. Open the check-in app to start scanning.
            </p>
          ) : (
            <div className="space-y-2">
              {recentCheckins.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                  <div>
                    <p className="font-medium">{c.firstName} {c.lastName}</p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </div>
                  {c.checkedInAt && (
                    <span className="text-xs text-muted-foreground">{formatDate(c.checkedInAt)}</span>
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
