import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-zinc-900">404</h1>
      <p className="text-lg text-zinc-500">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className={buttonVariants({ className: "mt-4" })}>
        Go Home
      </Link>
    </div>
  );
}
