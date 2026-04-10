import { Skeleton } from "@/components/ui/skeleton";

export default function CheckinLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-card px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="mt-1 h-4 w-20" />
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 p-4 sm:p-6">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </main>
    </div>
  );
}
