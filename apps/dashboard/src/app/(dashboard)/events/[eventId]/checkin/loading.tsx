import { Skeleton } from "@eventkit/ui/skeleton";

export default function CheckinDashboardLoading() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-stone-200 bg-white p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-8 w-12" />
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-lg border p-4">
        <Skeleton className="mb-4 h-5 w-32" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="mb-2 h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
