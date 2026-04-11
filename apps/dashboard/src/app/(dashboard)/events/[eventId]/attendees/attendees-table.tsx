"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Button } from "@eventkit/ui/button";
import { Input } from "@eventkit/ui/input";
import { Search, Download, ChevronLeft, ChevronRight, UserPlus } from "lucide-react";
import { AttendeeSheet } from "./attendee-sheet";
import { AddAttendeeDialog } from "./add-attendee-dialog";
import { AttendeeFilters } from "./attendee-filters";
import { AttendeesTableRows } from "./attendees-table-rows";
import { exportAttendeesToCsv } from "./export-csv";
import type { CustomField } from "@eventkit/types";

interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  paymentStatus: "pending" | "paid" | "free" | "refunded";
  checkedInAt: Date | null;
  createdAt: Date;
  ticketTypeId: string | null;
  jobTitle: string | null;
  userId?: string | null;
}

interface TicketType {
  id: string;
  name: string;
  price: number;
}

interface AttendeesTableProps {
  attendees: Attendee[];
  ticketTypes: TicketType[];
  eventId: string;
  currentPage: number;
  hasMore: boolean;
  filters: { search: string; status: string; ticketType: string; checkedIn: string };
  customFields: CustomField[];
}

export function AttendeesTable(props: AttendeesTableProps) {
  const { attendees, ticketTypes, eventId, currentPage, hasMore, filters, customFields } = props;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search);

  const ticketTypeMap = Object.fromEntries(ticketTypes.map((tt) => [tt.id, tt.name]));

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
      params.delete("page");
      router.push(`/events/${eventId}/attendees?${params.toString()}`);
    },
    [router, eventId, searchParams]
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ search: searchValue });
  }

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/events/${eventId}/attendees?${params.toString()}`);
  }

  const selected = attendees.find((a) => a.id === selectedId);

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search attendees..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="pl-9 w-64" />
            </div>
            <Button type="submit" variant="outline" size="sm">Search</Button>
          </form>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setAddSheetOpen(true)}>
              <UserPlus className="mr-1.5 h-3.5 w-3.5" />Add Attendee
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportAttendeesToCsv(attendees, ticketTypeMap, eventId)}>
              <Download className="mr-1.5 h-3.5 w-3.5" />Export CSV
            </Button>
          </div>
        </div>
        <AttendeeFilters ticketTypes={ticketTypes} filters={filters} onFilterChange={updateParams} />
        <div className="rounded-xl border bg-card">
          <div className="relative w-full overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b bg-stone-50">
                  {["Name", "Email", "Company", "Ticket", "Payment", "Checked In", "Date"].map((h) => (
                    <th key={h} className="h-10 px-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <AttendeesTableRows attendees={attendees} ticketTypeMap={ticketTypeMap} onSelectAttendee={setSelectedId} />
            </table>
          </div>
          {(currentPage > 1 || hasMore) && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => goToPage(currentPage - 1)}>
                <ChevronLeft className="mr-1 h-3.5 w-3.5" />Previous
              </Button>
              <span className="text-sm text-muted-foreground">Page {currentPage}</span>
              <Button variant="outline" size="sm" disabled={!hasMore} onClick={() => goToPage(currentPage + 1)}>
                Next<ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
      {selected && (
        <AttendeeSheet
          attendee={selected}
          ticketTypeName={selected.ticketTypeId ? ticketTypeMap[selected.ticketTypeId] ?? "-" : "-"}
          open={!!selectedId}
          onOpenChange={(open) => { if (!open) setSelectedId(null); }}
          eventId={eventId}
        />
      )}
      <AddAttendeeDialog
        open={addSheetOpen}
        onOpenChange={setAddSheetOpen}
        eventId={eventId}
        ticketTypes={ticketTypes}
        customFields={customFields}
      />
    </>
  );
}
