"use client";

export default function TicketsError() {
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
