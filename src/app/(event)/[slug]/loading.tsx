import { Skeleton } from "@/components/ui/skeleton";

export default function PublicEventLoading() {
  return (
    <div className="min-h-screen">
      <Skeleton className="h-[85vh] w-full" />
      <div className="mx-auto max-w-3xl px-6 py-24 space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
      </div>
    </div>
  );
}
