interface Attendee {
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  paymentStatus: string;
  checkedInAt: Date | null;
  createdAt: Date;
  ticketTypeId: string | null;
}

export function exportAttendeesToCsv(
  attendees: Attendee[],
  ticketTypeMap: Record<string, string>,
  eventId: string
) {
  const headers = [
    "First Name",
    "Last Name",
    "Email",
    "Company",
    "Ticket",
    "Payment",
    "Checked In",
    "Date",
  ];

  const rows = attendees.map((a) => [
    a.firstName,
    a.lastName,
    a.email,
    a.company ?? "",
    (a.ticketTypeId ? ticketTypeMap[a.ticketTypeId] : "") ?? "",
    a.paymentStatus,
    a.checkedInAt ? "Yes" : "No",
    new Date(a.createdAt).toISOString(),
  ]);

  const csv = [headers, ...rows]
    .map((r) => r.map((c) => `"${c}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `attendees-${eventId}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
