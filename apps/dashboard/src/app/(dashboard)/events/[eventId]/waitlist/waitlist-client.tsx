"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useWaitlist, useWaitlistStats } from "@/hooks/use-waitlist";
import { DataTableToolbar } from "@/components/dashboard/data-table-toolbar";
import { useDebouncedValue } from "@/hooks/use-debounce";
import { WaitlistTable } from "./waitlist-table";

interface WaitlistClientProps {
  eventId: string;
}

export function WaitlistClient({ eventId }: WaitlistClientProps) {
  const { data: entries, isLoading, error } = useWaitlist(eventId);
  const { data: stats } = useWaitlistStats(eventId);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const filteredEntries = (entries ?? []).filter((entry) => {
    if (!debouncedSearch) return true;
    const fullName =
      `${entry.firstName} ${entry.lastName}`.toLowerCase();
    const email = entry.email.toLowerCase();
    const q = debouncedSearch.toLowerCase();
    return fullName.includes(q) || email.includes(q);
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Waitlist</h1>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Waitlist</h1>
        </div>
        <div className="py-24 text-center text-sm text-destructive">
          Failed to load waitlist. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Waitlist</h1>
        <p className="text-sm text-muted-foreground">
          Manage waitlist entries for your event
        </p>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
              Waiting
            </p>
            <p className="mt-2 text-2xl font-semibold text-stone-900">
              {stats.waiting}
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
              Offered
            </p>
            <p className="mt-2 text-2xl font-semibold text-amber-600">
              {stats.offered}
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
              Accepted
            </p>
            <p className="mt-2 text-2xl font-semibold text-green-600">
              {stats.accepted}
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
              Total
            </p>
            <p className="mt-2 text-2xl font-semibold text-stone-900">
              {stats.total}
            </p>
          </div>
        </div>
      )}

      <DataTableToolbar
        searchPlaceholder="Search waitlist..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      <WaitlistTable entries={filteredEntries} eventId={eventId} />
    </div>
  );
}
