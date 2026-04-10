import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Users } from "lucide-react";

interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  paymentStatus: "pending" | "paid" | "free" | "refunded";
  checkedInAt: Date | null;
  createdAt: Date;
}

interface RecentAttendeesProps {
  attendees: Attendee[];
  eventId: string;
}

const paymentStatusStyles: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  free: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
  refunded: "bg-red-100 text-red-700",
};

export function RecentAttendees({ attendees, eventId }: RecentAttendeesProps) {
  if (attendees.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-12">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
            <Users className="h-6 w-6 text-zinc-400" />
          </div>
          <p className="text-sm font-medium">No attendees yet</p>
          <p className="text-xs text-muted-foreground">
            Share your event registration link to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Registrations</CardTitle>
        <CardAction>
          <Link href={`/events/${eventId}/attendees`}>
            <Button variant="ghost" size="sm">
              View all
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendees.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">
                  {a.firstName} {a.lastName}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {a.email}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={paymentStatusStyles[a.paymentStatus]}
                  >
                    {a.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(a.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
