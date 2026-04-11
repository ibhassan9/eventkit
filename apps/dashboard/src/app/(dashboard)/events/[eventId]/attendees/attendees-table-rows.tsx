"use client";

import { Badge } from "@eventkit/ui/badge";
import { formatDate } from "@eventkit/lib/utils";

interface OrderItem {
  ticketTypeId: string;
  quantity: number;
  ticketType: {
    name: string;
  };
}

interface Order {
  id: string;
  paymentStatus: string;
  totalAmount: number;
  items: OrderItem[];
}

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
  orders?: Order[];
}

interface AttendeesTableRowsProps {
  attendees: Attendee[];
  ticketTypeMap: Record<string, string>;
  onSelectAttendee: (id: string) => void;
}

const paymentStyles: Record<string, string> = {
  paid: "bg-green-50 text-green-700",
  free: "bg-stone-100 text-stone-700",
  pending: "bg-amber-50 text-amber-700",
  refunded: "bg-red-50 text-red-700",
};

function getTicketBadges(
  attendee: Attendee,
  ticketTypeMap: Record<string, string>
) {
  // If attendee has orders with items, use those
  if (attendee.orders && attendee.orders.length > 0) {
    const items = attendee.orders.flatMap((o) => o.items);
    if (items.length > 0) {
      return items.map((item) => ({
        key: `${item.ticketTypeId}-${item.quantity}`,
        label:
          item.quantity > 1
            ? `${item.quantity}× ${item.ticketType.name}`
            : item.ticketType.name,
      }));
    }
  }

  // Fall back to legacy ticketTypeId
  if (attendee.ticketTypeId && ticketTypeMap[attendee.ticketTypeId]) {
    return [
      {
        key: attendee.ticketTypeId,
        label: ticketTypeMap[attendee.ticketTypeId],
      },
    ];
  }

  return [];
}

export function AttendeesTableRows({
  attendees,
  ticketTypeMap,
  onSelectAttendee,
}: AttendeesTableRowsProps) {
  if (attendees.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={7} className="p-8 text-center text-muted-foreground">
            No attendees found. Adjust your filters or share your registration
            link.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {attendees.map((a) => {
        const badges = getTicketBadges(a, ticketTypeMap);
        return (
          <tr
            key={a.id}
            className="border-b transition-colors hover:bg-stone-50 cursor-pointer"
            onClick={() => onSelectAttendee(a.id)}
          >
            <td className="p-3 font-medium whitespace-nowrap">
              {a.firstName} {a.lastName}
            </td>
            <td className="p-3 text-muted-foreground whitespace-nowrap">
              {a.email}
            </td>
            <td className="p-3 text-muted-foreground whitespace-nowrap">
              {a.company ?? "-"}
            </td>
            <td className="p-3 whitespace-nowrap">
              {badges.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {badges.map((b) => (
                    <Badge
                      key={b.key}
                      variant="secondary"
                      className="bg-stone-100 text-stone-700 text-xs"
                    >
                      {b.label}
                    </Badge>
                  ))}
                </div>
              ) : (
                "-"
              )}
            </td>
            <td className="p-3 whitespace-nowrap">
              <Badge
                variant="secondary"
                className={paymentStyles[a.paymentStatus]}
              >
                {a.paymentStatus}
              </Badge>
            </td>
            <td className="p-3 whitespace-nowrap">
              <Badge
                variant={a.checkedInAt ? "secondary" : "outline"}
                className={a.checkedInAt ? "bg-green-50 text-green-700" : ""}
              >
                {a.checkedInAt ? "Yes" : "No"}
              </Badge>
            </td>
            <td className="p-3 text-muted-foreground whitespace-nowrap">
              {formatDate(a.createdAt)}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}
