import { AnimateOnScroll } from "./animate-on-scroll";
import { cn } from "@/lib/utils";

interface FeatureBlockProps {
  badge: string;
  title: string;
  description: string;
  reversed?: boolean;
  children: React.ReactNode;
}

export function FeatureBlock({
  badge,
  title,
  description,
  reversed = false,
  children,
}: FeatureBlockProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-12 lg:flex-row lg:gap-16",
        reversed && "lg:flex-row-reverse"
      )}
    >
      <AnimateOnScroll className="flex-1">
        <div className="max-w-lg">
          <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            {badge}
          </span>
          <h3 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            {title}
          </h3>
          <p className="mt-4 text-lg leading-relaxed text-zinc-500">
            {description}
          </p>
        </div>
      </AnimateOnScroll>
      <AnimateOnScroll className="flex-1" staggerIndex={2}>
        {children}
      </AnimateOnScroll>
    </div>
  );
}
