"use client";

import { useCallback } from "react";
import { CheckinApp } from "@/components/checkin/checkin-app";
import {
  performCheckIn,
  searchForAttendees,
  lookupQrCode,
  fetchCheckinStats,
} from "./actions";

interface CheckinPageClientProps {
  eventId: string;
  eventName: string;
}

export function CheckinPageClient({
  eventId,
  eventName,
}: CheckinPageClientProps) {
  const handleCheckIn = useCallback(
    async (attendeeId: string) => {
      return performCheckIn({ attendeeId, eventId });
    },
    [eventId]
  );

  const handleSearch = useCallback(
    async (query: string) => {
      return searchForAttendees({ eventId, query });
    },
    [eventId]
  );

  const handleLookupQr = useCallback(
    async (qrCode: string) => {
      return lookupQrCode({ qrCode, eventId });
    },
    [eventId]
  );

  const handleFetchStats = useCallback(
    async (eid: string) => {
      return fetchCheckinStats({ eventId: eid });
    },
    []
  );

  return (
    <CheckinApp
      eventId={eventId}
      eventName={eventName}
      performCheckIn={handleCheckIn}
      searchAttendees={handleSearch}
      lookupQrCode={handleLookupQr}
      fetchStats={handleFetchStats}
    />
  );
}
