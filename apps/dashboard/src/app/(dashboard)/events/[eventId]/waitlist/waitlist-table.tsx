"use client";

import { useState } from "react";
import { MoreHorizontal, Send, Trash2, ListOrdered } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@eventkit/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@eventkit/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@eventkit/ui/alert-dialog";
import {
  useOfferWaitlistSpot,
  useCancelWaitlistEntry,
} from "@/hooks/use-waitlist";
import { DataTableEmptyState } from "@/components/dashboard/data-table-empty-state";
import { OfferSpotDialog } from "./offer-spot-dialog";

type WaitlistEntry = {
  id: string;
  eventId: string;
  ticketTypeId: string;
  firstName: string;
  lastName: string;
  email: string;
  position: number;
  status: "waiting" | "offered" | "accepted" | "expired" | "cancelled";
  offeredAt: Date | null;
  offerExpiresAt: Date | null;
  convertedAttendeeId: string | null;
  createdAt: Date;
  updatedAt: Date;
  ticketType: {
    id: string;
    name: string;
  } | null;
};

interface WaitlistTableProps {
  entries: WaitlistEntry[];
  eventId: string;
}

const statusConfig: Record<
  string,
  { label: string; color: string }
> = {
  waiting: { label: "Waiting", color: "bg-blue-100 text-blue-700" },
  offered: { label: "Offered", color: "bg-amber-100 text-amber-700" },
  accepted: { label: "Accepted", color: "bg-green-100 text-green-700" },
  expired: { label: "Expired", color: "bg-stone-100 text-stone-600" },
  cancelled: { label: "Cancelled", color: "bg-stone-100 text-stone-600" },
};

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function WaitlistTable({ entries, eventId }: WaitlistTableProps) {
  const [removeTarget, setRemoveTarget] = useState<WaitlistEntry | null>(null);
  const [offerTarget, setOfferTarget] = useState<WaitlistEntry | null>(null);
  const cancelMutation = useCancelWaitlistEntry();

  if (entries.length === 0) {
    return (
      <DataTableEmptyState
        icon={ListOrdered}
        title="No waitlist entries"
        description="When tickets sell out and waitlist is enabled, entries will appear here"
      />
    );
  }

  async function handleRemove() {
    if (!removeTarget) return;
    const result = await cancelMutation.mutateAsync({
      eventId,
      entryId: removeTarget.id,
    });
    if (result.success) {
      toast.success("Waitlist entry removed");
      setRemoveTarget(null);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <>
      <div className="rounded-xl border bg-card">
        <div className="relative w-full overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b bg-stone-50">
                <th className="h-10 w-[60px] px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">
                  #
                </th>
                <th className="h-10 px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">
                  Name
                </th>
                <th className="h-10 px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">
                  Email
                </th>
                <th className="h-10 px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">
                  Ticket Type
                </th>
                <th className="h-10 w-[100px] px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">
                  Status
                </th>
                <th className="h-10 px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">
                  Joined
                </th>
                <th className="h-10 w-[50px] px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400" />
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const status = statusConfig[entry.status] ?? {
                  label: entry.status,
                  color: "bg-stone-100 text-stone-600",
                };
                return (
                  <tr
                    key={entry.id}
                    className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors text-[13px] text-stone-700"
                  >
                    <td className="px-3 py-3 font-medium text-stone-500">
                      {entry.position}
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-stone-900">
                        {entry.firstName} {entry.lastName}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-stone-500">
                      {entry.email}
                    </td>
                    <td className="px-3 py-3 text-stone-500">
                      {entry.ticketType?.name ?? "\u2014"}
                    </td>
                    <td className="px-3 py-3">
                      <Badge variant="secondary" className={status.color}>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-stone-500">
                      {formatDate(entry.createdAt)}
                    </td>
                    <td
                      className="px-3 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {(entry.status === "waiting" ||
                        entry.status === "offered") && (
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md p-1 hover:bg-stone-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {entry.status === "waiting" && (
                              <DropdownMenuItem
                                onClick={() => setOfferTarget(entry)}
                              >
                                <Send className="mr-2 h-3.5 w-3.5" />
                                Offer Spot
                              </DropdownMenuItem>
                            )}
                            {(entry.status === "waiting" ||
                              entry.status === "offered") && (
                              <>
                                {entry.status === "waiting" && (
                                  <DropdownMenuSeparator />
                                )}
                                <DropdownMenuItem
                                  variant="destructive"
                                  onClick={() => setRemoveTarget(entry)}
                                >
                                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                                  Remove
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Remove confirmation dialog */}
      <AlertDialog
        open={!!removeTarget}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from waitlist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {removeTarget?.firstName}{" "}
              {removeTarget?.lastName} from the waitlist? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleRemove}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Offer spot dialog */}
      {offerTarget && (
        <OfferSpotDialog
          open={!!offerTarget}
          onOpenChange={(open) => {
            if (!open) setOfferTarget(null);
          }}
          entry={offerTarget}
          eventId={eventId}
        />
      )}
    </>
  );
}
