import { Skeleton } from "@eventkit/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-2 h-4 w-60" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-stone-200 bg-card p-6">
          <Skeleton className="mb-2 h-6 w-28" />
          <Skeleton className="mb-4 h-4 w-48" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
