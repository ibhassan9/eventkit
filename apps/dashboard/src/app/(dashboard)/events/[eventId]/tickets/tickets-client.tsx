"use client";

import { useState } from "react";
import { Loader2, Plus, MoreHorizontal, Pencil, Copy, Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@eventkit/ui/button";
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
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@eventkit/ui/alert-dialog";
import { formatCurrency } from "@eventkit/lib/utils";
import {
  useTicketTypes,
  useDeleteTicketType,
  useUpdateTicketType,
  useDuplicateTicketType,
} from "@/hooks/use-ticket-types";
import { useWaitlistCounts } from "@/hooks/use-waitlist";
import { DataTableToolbar } from "@/components/dashboard/data-table-toolbar";
import { useDebouncedValue } from "@/hooks/use-debounce";
import { TicketDialog } from "./ticket-dialog";
import { TicketEmptyState } from "./ticket-empty-state";

interface TicketType {
  id: string;
  name: string;
  description: string | null;
  price: number;
  capacity: number | null;
  soldCount: number;
  salesStart: Date | null;
  salesEnd: Date | null;
  sortOrder: number;
  isVisible: boolean;
  allowWaitlist: boolean;
  minPerOrder: number;
  maxPerOrder: number;
}

interface TicketsClientProps {
  eventId: string;
}

function getTicketStatus(ticket: TicketType) {
  if (!ticket.isVisible) return { label: "Hidden", color: "bg-stone-100 text-stone-600" };
  if (ticket.capacity && ticket.soldCount >= ticket.capacity) return { label: "Sold Out", color: "bg-red-100 text-red-700" };
  if (ticket.salesEnd && new Date(ticket.salesEnd) < new Date()) return { label: "Ended", color: "bg-stone-100 text-stone-600" };
  if (ticket.salesStart && new Date(ticket.salesStart) > new Date()) return { label: "Scheduled", color: "bg-blue-100 text-blue-700" };
  return { label: "On Sale", color: "bg-green-100 text-green-700" };
}

export function TicketsClient({ eventId }: TicketsClientProps) {
  const { data: tickets, isLoading, error } = useTicketTypes(eventId);
  const { data: waitlistCounts } = useWaitlistCounts(eventId);
  const deleteMutation = useDeleteTicketType();
  const updateMutation = useUpdateTicketType();
  const duplicateMutation = useDuplicateTicketType();

  // Build a map of ticketTypeId -> waitlist count
  const waitlistCountMap: Record<string, number> = {};
  if (waitlistCounts) {
    for (const item of waitlistCounts) {
      waitlistCountMap[item.ticketTypeId] = item.count;
    }
  }

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [deleteTarget, setDeleteTarget] = useState<TicketType | null>(null);

  function handleEdit(ticketId: string) {
    setEditingTicketId(ticketId);
    setSheetOpen(true);
  }

  function handleCreate() {
    setEditingTicketId(null);
    setSheetOpen(true);
  }

  function handleSheetClose() {
    setSheetOpen(false);
    setEditingTicketId(null);
  }

  function handleDuplicate(ticket: TicketType) {
    duplicateMutation.mutate(
      { eventId, ticketTypeId: ticket.id },
      {
        onSuccess: (result) => {
          if (result.success) toast.success("Ticket duplicated");
          else toast.error(result.error);
        },
      }
    );
  }

  function handleToggleVisibility(ticket: TicketType) {
    updateMutation.mutate(
      { eventId, ticketTypeId: ticket.id, isVisible: !ticket.isVisible },
      {
        onSuccess: (result) => {
          if (result.success)
            toast.success(ticket.isVisible ? "Ticket hidden" : "Ticket visible");
          else toast.error(result.error);
        },
      }
    );
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(
      { eventId, ticketTypeId: deleteTarget.id },
      {
        onSuccess: (result) => {
          if (result.success) toast.success("Ticket deleted");
          else toast.error(result.error);
        },
      }
    );
    setDeleteTarget(null);
  }

  function handleHideInstead() {
    if (!deleteTarget) return;
    updateMutation.mutate(
      { eventId, ticketTypeId: deleteTarget.id, isVisible: false },
      {
        onSuccess: (result) => {
          if (result.success) toast.success("Ticket hidden from registration");
          else toast.error(result.error);
        },
      }
    );
    setDeleteTarget(null);
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tickets</h1>
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
          <h1 className="text-2xl font-semibold tracking-tight">Tickets</h1>
        </div>
        <div className="py-24 text-center text-sm text-destructive">
          Failed to load tickets. Please try again.
        </div>
      </div>
    );
  }

  const editingTicket = editingTicketId
    ? tickets?.find((t) => t.id === editingTicketId) ?? null
    : null;

  const filteredTickets = (tickets ?? []).filter((ticket) =>
    ticket.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tickets</h1>
        <p className="text-sm text-muted-foreground">
          Manage ticket types and pricing for your event.
        </p>
      </div>

      {!tickets || tickets.length === 0 ? (
        <TicketEmptyState onCreate={handleCreate} />
      ) : (
        <>
          <DataTableToolbar
            searchPlaceholder="Search tickets..."
            searchValue={search}
            onSearchChange={setSearch}
            actions={
              <Button onClick={handleCreate}>
                <Plus className="mr-1.5 h-4 w-4" />
                Create Ticket
              </Button>
            }
          />

          <div className="rounded-xl border bg-card">
            <div className="relative w-full overflow-x-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b bg-stone-50">
                    <th className="h-10 px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">Name</th>
                    <th className="h-10 w-[100px] px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">Price</th>
                    <th className="h-10 w-[80px] px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">Sold</th>
                    <th className="h-10 w-[80px] px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">Capacity</th>
                    <th className="h-10 w-[100px] px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">Status</th>
                    <th className="h-10 w-[50px] px-3" />
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => {
                    const status = getTicketStatus(ticket);
                    return (
                      <tr
                        key={ticket.id}
                        className="border-b border-stone-100 hover:bg-stone-50/50 cursor-pointer transition-colors text-[13px] text-stone-700"
                        onClick={() => handleEdit(ticket.id)}
                      >
                        <td className="px-3 py-2.5">
                          <div className="font-medium text-stone-900">{ticket.name}</div>
                          {ticket.description && (
                            <div className="text-xs text-stone-400 truncate max-w-xs">{ticket.description}</div>
                          )}
                          {ticket.allowWaitlist &&
                            ticket.capacity &&
                            ticket.soldCount >= ticket.capacity &&
                            (waitlistCountMap[ticket.id] ?? 0) > 0 && (
                              <div className="text-xs text-amber-600">
                                {waitlistCountMap[ticket.id]} on waitlist
                              </div>
                            )}
                        </td>
                        <td className="px-3 py-2.5">
                          {ticket.price === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            formatCurrency(ticket.price, "CAD")
                          )}
                        </td>
                        <td className="px-3 py-2.5">{ticket.soldCount}</td>
                        <td className="px-3 py-2.5">{ticket.capacity ?? "\u221E"}</td>
                        <td className="px-3 py-2.5">
                          <Badge variant="secondary" className={status.color}>
                            {status.label}
                          </Badge>
                        </td>
                        <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md p-1 hover:bg-stone-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(ticket.id)}>
                                <Pencil className="mr-2 h-3.5 w-3.5" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(ticket)}>
                                <Copy className="mr-2 h-3.5 w-3.5" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleVisibility(ticket)}>
                                {ticket.isVisible ? (
                                  <>
                                    <EyeOff className="mr-2 h-3.5 w-3.5" />
                                    Hide
                                  </>
                                ) : (
                                  <>
                                    <Eye className="mr-2 h-3.5 w-3.5" />
                                    Show
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setDeleteTarget(ticket)}
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <TicketDialog
        open={sheetOpen}
        onOpenChange={handleSheetClose}
        eventId={eventId}
        ticket={editingTicket}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteTarget && deleteTarget.soldCount > 0
                ? "Cannot delete this ticket"
                : `Delete "${deleteTarget?.name}"?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && deleteTarget.soldCount > 0
                ? `This ticket type has been purchased by ${deleteTarget.soldCount} attendee${deleteTarget.soldCount !== 1 ? "s" : ""} and cannot be deleted. You can hide it from the registration page instead.`
                : "This action cannot be undone. This ticket type will be permanently deleted."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {deleteTarget && deleteTarget.soldCount > 0 ? (
              <AlertDialogAction onClick={handleHideInstead}>
                Hide Ticket
              </AlertDialogAction>
            ) : (
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
