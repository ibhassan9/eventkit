"use client";

import { Users, UserCheck, UserX } from "lucide-react";
import { Card, CardContent } from "@eventkit/ui/card";

interface StatsCardsProps {
  total: number;
  checkedIn: number;
  remaining: number;
}

export function StatsCards({ total, checkedIn, remaining }: StatsCardsProps) {
  const percentage = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground">Total Attendees</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <UserCheck className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{checkedIn}</p>
            <p className="text-xs text-muted-foreground">
              Checked In ({percentage}%)
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <UserX className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-600">{remaining}</p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
