"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@eventkit/ui/tabs";
import { Camera, Search } from "lucide-react";
import { QrScanner } from "./qr-scanner";
import { AttendeeSearch } from "./attendee-search";
import { AttendeeCard } from "./attendee-card";
import { CheckinStatsBar } from "./checkin-stats-bar";

interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  ticketType?: { name: string } | null;
  checkedInAt: string | null;
}

interface CheckinAppProps {
  eventId: string;
  eventName: string;
  performCheckIn: (
    attendeeId: string
  ) => Promise<{ success: boolean; error?: string }>;
  searchAttendees: (query: string) => Promise<{
    success: boolean;
    data?: Attendee[];
    error?: string;
  }>;
  lookupQrCode: (qrCode: string) => Promise<{
    success: boolean;
    data?: Attendee;
    error?: string;
  }>;
  fetchStats: (eventId: string) => Promise<{
    success: boolean;
    data?: { total: number; checkedIn: number; remaining: number };
    error?: string;
  }>;
}

export function CheckinApp({
  eventId,
  eventName,
  performCheckIn,
  searchAttendees,
  lookupQrCode,
  fetchStats,
}: CheckinAppProps) {
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedAttendee, setScannedAttendee] = useState<Attendee | null>(
    null
  );

  const handleScan = useCallback(
    async (data: string) => {
      const result = await lookupQrCode(data);
      if (result.success && result.data) {
        setScannedAttendee(result.data);
      } else {
        toast.error(result.error ?? "QR code not recognized");
      }
    },
    [lookupQrCode]
  );

  const handleCheckIn = useCallback(
    async (attendeeId: string) => {
      const result = await performCheckIn(attendeeId);
      return result;
    },
    [performCheckIn]
  );

  const handleSearch = useCallback(
    async (query: string) => {
      return searchAttendees(query);
    },
    [searchAttendees]
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-card px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">{eventName}</h1>
            <p className="text-sm text-muted-foreground">Check-in</p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 p-4 sm:p-6">
        <CheckinStatsBar eventId={eventId} fetchStats={fetchStats} />

        <Tabs defaultValue="scan" className="w-full">
          <TabsList className="grid h-14 w-full grid-cols-2">
            <TabsTrigger value="scan" className="h-12 text-base">
              <Camera className="mr-2 h-5 w-5" />
              Scan
            </TabsTrigger>
            <TabsTrigger value="search" className="h-12 text-base">
              <Search className="mr-2 h-5 w-5" />
              Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="mt-4 space-y-4">
            <QrScanner
              active={scannerActive}
              onToggle={() => {
                setScannerActive((prev) => !prev);
                setScannedAttendee(null);
              }}
              onScan={handleScan}
            />
            {scannedAttendee && (
              <AttendeeCard
                attendee={scannedAttendee}
                onCheckIn={handleCheckIn}
              />
            )}
          </TabsContent>

          <TabsContent value="search" className="mt-4">
            <AttendeeSearch
              onSearch={handleSearch}
              onCheckIn={handleCheckIn}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
