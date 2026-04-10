import { Skeleton } from "@/components/ui/skeleton";

export default function PricingLoading() {
  return (
    <div className="pt-16">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-full max-w-md" />
          <Skeleton className="h-6 w-full max-w-sm" />
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
