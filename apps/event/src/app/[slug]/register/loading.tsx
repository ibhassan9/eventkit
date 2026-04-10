import { Skeleton } from "@eventkit/ui/skeleton";

export default function RegisterLoading() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8 text-center space-y-2">
          <Skeleton className="mx-auto h-8 w-64" />
          <Skeleton className="mx-auto h-4 w-48" />
        </div>
        <div className="space-y-3 mb-8">
          <Skeleton className="h-6 w-32" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
        </div>
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="mt-8 h-12 rounded-lg" />
      </div>
    </div>
  );
}
