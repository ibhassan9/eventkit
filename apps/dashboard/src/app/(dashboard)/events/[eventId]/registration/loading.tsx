import { Skeleton } from "@eventkit/ui/skeleton";

export default function RegistrationBuilderLoading() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="flex items-center justify-between gap-3 mb-6">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-20" />
      </div>
      <Skeleton className="h-40 w-full rounded-xl mb-6" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}
