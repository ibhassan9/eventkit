"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, UserCheck, UserX } from "lucide-react";

interface CheckinStats {
  total: number;
  checkedIn: number;
  remaining: number;
}

interface CheckinStatsBarProps {
  eventId: string;
  fetchStats: (eventId: string) => Promise<{
    success: boolean;
    data?: CheckinStats;
    error?: string;
  }>;
}

export function CheckinStatsBar({ eventId, fetchStats }: CheckinStatsBarProps) {
  const [stats, setStats] = useState<CheckinStats>({
    total: 0,
    checkedIn: 0,
    remaining: 0,
  });

  const refresh = useCallback(async () => {
    const result = await fetchStats(eventId);
    if (result.success && result.data) {
      setStats(result.data);
    }
  }, [eventId, fetchStats]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  const percentage =
    stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0;

  return (
    <div className="flex items-center gap-6 rounded-xl border bg-card px-6 py-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <UserCheck className="h-5 w-5 text-green-600" />
        <div>
          <p className="text-2xl font-bold text-green-600">{stats.checkedIn}</p>
          <p className="text-xs text-muted-foreground">Checked In</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <UserX className="h-5 w-5 text-amber-600" />
        <div>
          <p className="text-2xl font-bold text-amber-600">{stats.remaining}</p>
          <p className="text-xs text-muted-foreground">Remaining</p>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="h-2 w-32 overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
    </div>
  );
}
