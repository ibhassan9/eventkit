import { Skeleton } from "@eventkit/ui/skeleton";

export default function MarketingLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-14 w-full max-w-lg" />
      <Skeleton className="h-6 w-full max-w-md" />
      <div className="flex gap-4">
        <Skeleton className="h-12 w-36 rounded-xl" />
        <Skeleton className="h-12 w-36 rounded-xl" />
      </div>
    </div>
  );
}
